import { base58, Context, u128, util } from "near-sdk-core";
import { AnswerStorage } from "../storage/answer.storage";
import { FormAnalysistStorage, FormStorage, ParticipantFormStorage, UserFormStorage } from "../storage/form.storage";
import { ParticipantAnswerIndexStorage } from "../storage/participant.storage";
import { QuestionStorage, FormQuestionStorage } from "../storage/question.storage";
import { Participant } from "./participant.model";
import Question from "./question.model";
import { QuestionType } from "./question.model";

@nearBindgen
class Form {
    public id: string;
    private owner: string;
    private q_counter: i32;
    private q_participant: i32;
    constructor(private title: string) {
        this.q_counter = 0;
        this.q_participant = 0;
        this.owner = Context.sender;
        this.generateId();
    }

    public getId(): string {
        return this.id;
    }

    public getMaxQuestion(): i32 {
        return this.q_counter;
    }

    public getOwner(): string {
        return this.owner;
    }

    private generateId(): void {
        let formId: string = "";
        while (formId == "") {
            const blockTime = Context.sender + Context.blockTimestamp.toString();
            const hBlockTime = base58.encode(util.stringToBytes(blockTime));
            if (!FormStorage.contains(hBlockTime)) {
                formId = hBlockTime;
            }
        }
        this.id = formId;
    }

    updateTitle(newTitle: string): void {
        if (newTitle != "" && this.title != newTitle) {
            this.title = newTitle;
        }
    }

    save(): void {
        FormStorage.set(this.id, this);
        UserFormStorage.set(this.owner, this.id);
    }

    remove(): void {
        FormStorage.delete(this.id);
        UserFormStorage.delete(this.owner, this.id);
        const questions = FormQuestionStorage.gets(this.id);
        const questions_length = questions.length;
        for (let i = 0; i < questions_length; i++) {
            questions[i].remove();
        }
    }

    addQuestion(type: QuestionType, title: string, meta: string): Question | null {
        const sender = Context.sender;
        if (this.owner == sender) {
            this.q_counter += 1;
            const newQuest = new Question(type, title, meta, this.id);
            newQuest.save();
            this.save();
            return newQuest;
        }
        return null;
    }

    removeQuestion(id: string): bool {
        this.q_counter -= 1;
        if (this.q_counter < 0) {
            this.q_counter = 0;
        }
        const qIndex = Question.delete(this.id, id);
        if (qIndex > -1) {
            const participants = ParticipantFormStorage.get(this.id);
            const participantsLength = participants.length;
            for (let i = 0; i < participantsLength; i++) {
                this.updateParticipantQuestionIndex(id, qIndex, participants[i]);
            }
        }

        this.save();
        return true;
    }

    updateParticipantQuestionIndex(qId: string, qIndex: i32, participant: string): void {
        const cIndex = Participant.get_cur_ans_index(participant, this.id);
        if (cIndex != -1 && cIndex >= qIndex) {
            //If cIndex < qIndex: Nothing
            //If cIndex >= qIndex: -> decrease cIndex by 1, remove the passed answer
            Participant.set_current_ans_index(participant, this.id, cIndex - 1);
            AnswerStorage.delete(this.id, participant, qId);
        }
    }

    getTitle(): string {
        return this.title;
    }

    toString(): string {
        return `{id: ${this.id}, owner: ${this.owner},q_counter: ${this.q_counter.toString()}}`;
    }

    incParticipant(userId: string): void {
        const isExsited = ParticipantFormStorage.contain(userId, this.id);
        if (!isExsited) {
            this.q_participant += 1;
            this.save();
        }
    }
}

export default Form;
