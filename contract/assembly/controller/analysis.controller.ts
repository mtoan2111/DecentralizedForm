import { Context, PersistentVector } from "near-sdk-core";
import { UserAnswer } from "../model/answer.model";
import Form from "../model/form.model";
import Question from "../model/question.model";
import { QuestionType } from "../model/question.model";
import { AnswerStorage } from "../storage/answer.storage";
import { FormStorage, FormAnalysistStorage } from "../storage/form.storage";
import { FormQuestionStorage, QuestionStorage } from "../storage/question.storage";

// export function getFormInfo(formId: string): Form | null {
//     return FormStorage.get(formId);
// }

export function getFormTitle(formId: string): string | null {
    let form: Form | null = FormStorage.get(formId);
    if (form) {
        return form.getTitle();
    }
    return null;
}

export function getNumOfQuestions(formId: string): i32 {
    let form: Form | null = FormStorage.get(formId);
    if (form) {
        return form.getMaxQuestion();
    }
    return -1;
}

export function getListParticipants(formId: string): PersistentVector<string> | null {
    if (FormAnalysistStorage.contains(formId)) {
        return FormAnalysistStorage.get(formId);
    }
    return null;
}

export function getParticipantResult(formId: string, participantId: string): UserAnswer[] | null {
    return AnswerStorage.get(formId, participantId);
}

export function getNumOfParticipant(formId: string): i32 {
    let form: Form | null = FormStorage.get(formId);
    if (form) {
        // return form.getNumOfParticipant();
        return -1;
    }
    return -1;
}
