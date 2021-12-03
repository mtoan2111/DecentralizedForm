import * as Form from "./controller/form.controller";
import * as Question from "./controller/question.controller";
import * as Analysis from "./controller/analysis.controller";
import * as Answer from "./controller/answer.controller";

import { PaginationResult } from "./helper/pagination.helper";
import FormModel from "./model/form.model";
import QuestionModel from "./model/question.model";
import { QuestionType } from "./model/question.model";
import { PersistentVector } from "near-sdk-core";
import { UserAnswer } from "./model/answer.model";

export function init_new_form(title: string): string | null {
    return Form.init_new_form(title);
}

export function get_form(id: string): FormModel | null {
    return Form.get_form(id);
}

export function get_forms(userId: string, page: i32): PaginationResult<FormModel> {
    return Form.get_forms(userId, page);
}

export function new_question(formId: string, type: QuestionType, title: string, meta: string): QuestionModel | null {
    return Question.new_question(formId, type, title, meta);
}

export function delete_question(id: string): bool {
    return Question.delete_question(id);
}

export function get_question(userId: string, formId: string): QuestionModel | null {
    return Question.get_question(userId, formId);
}

export function get_questions(userId: string, formId: string, page: i32): PaginationResult<QuestionModel> {
    return Question.get_questions(userId, formId, page);
}

export function get_question_count(formId: string): i32 {
    return Question.get_question_count(formId);
}

export function get_form_count(userId: string): i32 {
    return Form.get_form_count(userId);
}

export function getFormTitle(formId: string): string | null {
    return Analysis.getFormTitle(formId);
}

export function getNumOfQuestions(formId: string): i32 {
    return Analysis.getNumOfQuestions(formId);
}

export function getListParticipants(formId: string): PersistentVector<string> | null {
    return Analysis.getListParticipants(formId);
}

export function getParticipantResult(formId: string, participantId: string): UserAnswer[] | null {
    return Analysis.getParticipantResult(formId, participantId);
}

export function getNumOfParticipant(formId: string): i32 {
    return Analysis.getNumOfParticipant(formId);
}
export function submit_answer(formId: string, questionId: string, answer: string): bool {
    return Answer.submit_answer(formId, questionId, answer);
}

export function update_question(id: string, title: string, meta: string): QuestionModel | null {
    return Question.update_question(id, title, meta);
}

export function update_form(id: string, title: string): FormModel | null {
    return Form.update_form(id, title);
}

export function delete_form(id: string): bool {
    return Form.delete_form(id);
}

export function get_answer_statistical(userId: string, formId: string, page: i32): PaginationResult<UserAnswer> {
    return Answer.get_answer_statistical(userId, formId, page);
}

export function get_participants(formId: string, page: i32): PaginationResult<string> {
    return Form.get_participants(formId, page);
}
