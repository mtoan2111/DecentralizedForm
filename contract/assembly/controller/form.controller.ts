import { base58, Context, util } from "near-sdk-core";
import { pagination, PaginationResult } from "../helper/pagination.helper";
import Form from "../model/form.model";
import { QuestionType } from "../model/question.model";
import { FormStorage, ParticipantFormStorage, UserFormStorage } from "../storage/form.storage";

export function init_new_form(title: string): string | null {
    if (title == "") {
        return null;
    }
    const newForm = new Form(title);
    newForm.save();
    return newForm.getId();
}

export function get_form(id: string): Form | null {
    return FormStorage.get(id);
}

export function get_forms(userId: string, page: i32): PaginationResult<Form> {
    const forms = UserFormStorage.gets(userId);
    return pagination<Form>(forms, page);
}

export function get_form_count(userId: string): i32 {
    return UserFormStorage.count(userId);
}

export function update_form(id: string, title: string): Form | null {
    const sender = Context.sender;
    const existedForm = FormStorage.get(id);
    if (existedForm == null || existedForm.getOwner() != sender) {
        return null;
    }
    existedForm.updateTitle(title);
    existedForm.save();
    return existedForm;
}

export function delete_form(id: string): bool {
    const sender = Context.sender;
    const existedForm = FormStorage.get(id);
    if (existedForm == null || existedForm.getOwner() != sender) {
        return false;
    }
    existedForm.remove();
    return true;
}

export function get_participants(formId: string, page: i32): PaginationResult<string> {
    const form = FormStorage.get(formId);
    if (form == null) {
        return new PaginationResult(1, 0, new Array<string>(0));
    }

    const participants = ParticipantFormStorage.get(formId);
    return pagination(participants, page);
}
