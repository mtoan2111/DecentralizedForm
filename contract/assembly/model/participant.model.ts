import { Context, logging } from "near-sdk-core";
import { FormStorage } from "../storage/form.storage";
import { FormQuestionStorage } from "../storage/question.storage";
import { ParticipantAnswerIndexStorage } from "../storage/participant.storage";
import Question from "./question.model";

@nearBindgen
export class Participant {
    static get_cur_ans_index(userId: string, formId: string): i32 {
        const form = FormStorage.get(formId);
        if (form == null) {
            return -1;
        }

        const cIndex = ParticipantAnswerIndexStorage.get(userId, formId);
        return cIndex;
    }

    static get_next_question(userId: string, formId: string): Question | null {
        const form = FormStorage.get(formId);
        if (form == null) {
            return null;
        }

        let cIndex = ParticipantAnswerIndexStorage.get(userId, formId);
        const nIndex = cIndex + 1;
        const questions = FormQuestionStorage.gets(formId);
        const questions_length = questions.length;
        if (questions_length - 1 < nIndex) {
            return null;
        }

        return questions[nIndex];
    }

    static set_current_ans_index(userId: string, formId: string, cIndex: i32): void {
        ParticipantAnswerIndexStorage.set(userId, formId, cIndex);
    }
}
