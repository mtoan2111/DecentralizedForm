import { Context } from "near-sdk-core";
import { AnswerStorage } from "../storage/answer.storage";
import { ParticipantFormStorage } from "../storage/form.storage";
import { QuestionType } from "./question.model";

@nearBindgen
export class UserAnswer {
    constructor(private qId: string, private title: string, private type: QuestionType, private answer: string) {}
}

@nearBindgen
class Answer {
    private owner: string;
    constructor(private formId: string, private questionId: string, private ans: string) {
        this.owner = Context.sender;
    }

    save(): void {
        ParticipantFormStorage.set(this.owner, this.formId);
        AnswerStorage.set(this.formId, this.owner, this.questionId, this.ans);
    }
}

export default Answer;
