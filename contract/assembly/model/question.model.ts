import { base58, Context, util } from "near-sdk-core";
import { FormQuestionStorage, QuestionStorage } from "../storage/question.storage";

export enum QuestionType {
    YESNO,
    ONCE,
    MANY,
    FILL,
}

@nearBindgen
class Question {
    private id: string;
    private owner: string;
    constructor(private type: QuestionType, private title: string, private meta: string, private formId: string) {
        this.owner = Context.sender;
        this.generateId(formId);
    }

    private generateId(formId: string): void {
        let questionId: string = "";
        while (questionId == "") {
            const blockTime = formId + Context.blockTimestamp.toString();
            const hBlockTime = base58.encode(util.stringToBytes(blockTime));
            if (!QuestionStorage.contains(hBlockTime)) {
                questionId = hBlockTime;
            }
        }
        this.id = questionId;
    }

    getId(): string {
        return this.id;
    }

    getFormId(): string {
        return this.formId;
    }

    getTitle(): string {
        return this.title;
    }

    getOwner(): string {
        return this.owner;
    }

    getType(): QuestionType {
        return this.type;
    }

    updateTitle(newTitle: string): void {
        const sender = Context.sender;
        if (newTitle != "" && newTitle != null && newTitle != this.title && this.owner == sender) {
            this.title = newTitle;
        }
    }

    updateMeta(newMeta: string): void {
        const sender = Context.sender;
        if (newMeta != "" && newMeta != null && newMeta != this.meta && this.owner == sender) {
            this.meta = newMeta;
        }
    }

    save(): void {
        QuestionStorage.set(this.id, this);
        FormQuestionStorage.set(this.formId, this.id);
    }

    remove(): void {
        QuestionStorage.delete(this.id);
        FormQuestionStorage.delete(this.formId, this.id);
    }

    toString(): string {
        return `{id: ${this.id}, owner: ${this.owner},q_counter: ${this.title}, title: ${this.title}, meta:${this.meta}}`;
    }

    static delete(formId: string, questionId: string): i32 {
        QuestionStorage.delete(questionId);
        return FormQuestionStorage.delete(formId, questionId);
    }
}

export default Question;
