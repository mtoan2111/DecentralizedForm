import { logging, PersistentUnorderedMap, PersistentVector } from "near-sdk-as";
import Form from "../model/form.model";
import Question from "../model/question.model";

const userFormPersit = new PersistentUnorderedMap<string, string>("uFP");
const participantFormPersit = new PersistentUnorderedMap<string, string>("pFP");
const formPersit = new PersistentUnorderedMap<string, Form>("fP");
const formAnalysis = new PersistentUnorderedMap<string, PersistentVector<string>>("fA");

export class FormStorage {
    static get(id: string): Form | null {
        if (formPersit.contains(id)) {
            return formPersit.getSome(id);
        }
        return null;
    }

    static set(id: string, value: Form): void {
        formPersit.set(id, value);
    }

    static gets(): Form[] {
        return formPersit.values();
    }

    static contains(id: string): bool {
        return formPersit.contains(id);
    }

    static delete(id: string): void {
        formPersit.delete(id);
    }
}

export class FormAnalysistStorage {
    static get(id: string): PersistentVector<string> | null {
        if (formAnalysis.contains(id)) {
            return formAnalysis.getSome(id);
        }
        return null;
    }

    static add(formId: string, participantID: string): void {
        formAnalysis.getSome(formId).push(participantID);
        const ls_part: PersistentVector<string> = formAnalysis.getSome(formId);
        formAnalysis.set(formId, ls_part);
    }

    static set(formId: string, value: PersistentVector<string> = new PersistentVector<string>(formId)): void {
        formAnalysis.set(formId, value);
    }

    static contains(formId: string): bool {
        return formAnalysis.contains(formId);
    }

    static delete(formId: string): void {
        formAnalysis.delete(formId);
    }
}

export class UserFormStorage {
    static gets(id: string): Form[] {
        if (userFormPersit.contains(id)) {
            const formIdSerialize = userFormPersit.getSome(id);
            if (formIdSerialize == "" || formIdSerialize == null) {
                return new Array<Form>(0);
            }
            const formIds = formIdSerialize.split(",");
            const formSize = formIds.length;
            const ret: Set<Form> = new Set<Form>();
            for (let i = 0; i < formSize; i++) {
                if (formPersit.contains(formIds[i])) {
                    const formDetails = formPersit.getSome(formIds[i]);
                    ret.add(formDetails);
                }
            }
            return ret.values();
        }
        return new Array<Form>(0);
    }

    static set(userId: string, formId: string): void {
        if (userFormPersit.contains(userId)) {
            let formIdSerialize = userFormPersit.getSome(userId);
            if (formIdSerialize == "" || formIdSerialize == null) {
                formIdSerialize = "";
            }
            let formIds = formIdSerialize.split(",");
            const fIndex = formIds.indexOf(formId);
            if (fIndex == -1) {
                formIds.push(formId);
                formIdSerialize = formIds.join(",");
                userFormPersit.set(userId, formIdSerialize);
            }
        } else {
            userFormPersit.set(userId, formId);
        }
    }

    static count(userId: string): i32 {
        if (userFormPersit.contains(userId)) {
            const formIdSerialize = userFormPersit.getSome(userId);
            if (formIdSerialize == "" || formIdSerialize == null) {
                return 0;
            }
            const formIds = formIdSerialize.split(",");
            const formIdLengths = formIds.length;
            let num = 0;
            for (let i = 0; i < formIdLengths; i++) {
                if (formIds[i] != '') {
                    num++;
                }
            }
            return num;
        }
        return 0;
    }

    static delete(userId: string, formId: string): void {
        if (userFormPersit.contains(userId)) {
            let formIdSerialize = userFormPersit.getSome(userId);

            if (formIdSerialize == "" || formIdSerialize == null) {
                formIdSerialize = "";
            }
            let formIds = formIdSerialize.split(",");
            const dIndex = formIds.indexOf(formId);
            if (dIndex > -1) {
                formIds.splice(dIndex, 1);
            }
            formIdSerialize = formIds.join(",");
            userFormPersit.set(userId, formIdSerialize);
        }
    }
}

export class ParticipantFormStorage {
    static get(formId: string): string[] {
        if (participantFormPersit.contains(formId)) {
            const participantIdsSerialize = participantFormPersit.getSome(formId);
            if (participantIdsSerialize == null || participantIdsSerialize == "") {
                return new Array<string>(0);
            }

            const participantIds = participantIdsSerialize.split(";");
            return participantIds;
        }

        return new Array<string>(0);
    }

    static set(userId: string, formId: string): void {
        if (participantFormPersit.contains(formId)) {
            let participantIdsSerialize = participantFormPersit.getSome(formId);
            if (participantIdsSerialize == null || participantIdsSerialize == "") {
                participantIdsSerialize = "";
            }

            const participantIds = participantIdsSerialize.split(";");
            const pIndex = participantIds.indexOf(userId);
            if (pIndex == -1) {
                participantIds.push(userId);
                participantIdsSerialize = participantIds.join(";");
                participantFormPersit.set(formId, participantIdsSerialize);
            }
        } else {
            participantFormPersit.set(formId, userId);
        }
    }

    static contain(userId: string, formId: string): bool {
        if (participantFormPersit.contains(formId)) {
            let participantIdsSerialize = participantFormPersit.getSome(formId);
            if (participantIdsSerialize == null || participantIdsSerialize == "") {
                return false;
            }

            const participantIds = participantIdsSerialize.split(";");
            const pIndex = participantIds.indexOf(userId);
            if (pIndex == -1) {
                return false;
            }
            return true;
        }
        return false;
    }
}
