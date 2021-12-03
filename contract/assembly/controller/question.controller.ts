import { Context } from "near-sdk-core";
import { pagination, PaginationResult } from "../helper/pagination.helper";
import Question from "../model/question.model";
import { QuestionType } from "../model/question.model";
import { Participant } from "../model/participant.model";
import { FormStorage } from "../storage/form.storage";
import { FormQuestionStorage, QuestionStorage } from "../storage/question.storage";

export function new_question(formId: string, type: QuestionType, title: string, meta: string): Question | null {
    if (title == "") {
        return null;
    }
    const existedForm = FormStorage.get(formId);
    if (existedForm == null) {
        return null;
    }

    return existedForm.addQuestion(type, title, meta);
}

export function delete_question(id: string): bool {
    const sender = Context.sender;
    const existedQuestion = QuestionStorage.get(id);
    if (existedQuestion == null || existedQuestion.getOwner() != sender) {
        return false;
    }

    const existedForm = FormStorage.get(existedQuestion.getFormId());
    if (existedForm == null) {
        return false;
    }

    existedForm.removeQuestion(id);
    return true;
}

export function update_question(id: string, title: string, meta: string): Question | null {
    const sender = Context.sender;
    const existedQuestion = QuestionStorage.get(id);
    if (existedQuestion == null || existedQuestion.getOwner() != sender) {
        return null;
    }

    existedQuestion.updateTitle(title);
    existedQuestion.updateMeta(meta);
    existedQuestion.save();
    return existedQuestion;
}

export function get_question(userId: string, formId: string): Question | null {
    return Participant.get_next_question(userId, formId);
}

export function get_question_count(formId: string): i32 {
    const form = FormStorage.get(formId);
    if (form == null) {
        return 0;
    }
    return form.getMaxQuestion();
}

export function get_questions(userId: string, formId: string, page: i32): PaginationResult<Question> {
    const form = FormStorage.get(formId);
    if (form && form.getOwner() != userId) {
        return new PaginationResult(1, 0, new Array<Question>(0));
    }
    const questions = FormQuestionStorage.gets(formId);
    return pagination<Question>(questions, page);
}
