import { logging, PersistentUnorderedMap } from "near-sdk-as";
import Question from "../model/question.model";

const formQuestionPersist = new PersistentUnorderedMap<string, string>("fAP");
const questionPersit = new PersistentUnorderedMap<string, Question>("aP");

export class QuestionStorage {
    static get(id: string): Question | null {
        if (questionPersit.contains(id)) {
            return questionPersit.getSome(id);
        }
        return null;
    }

    static set(id: string, value: Question): void {
        questionPersit.set(id, value);
    }

    static gets(): Question[] {
        return questionPersit.values();
    }

    static contains(id: string): bool {
        return questionPersit.contains(id);
    }

    static delete(id: string): void {
        questionPersit.delete(id);
    }
}

export class FormQuestionStorage {
    static gets(id: string): Question[] {
        if (formQuestionPersist.contains(id)) {
            const questionIdSerialize = formQuestionPersist.getSome(id);
            if (questionIdSerialize == "" || questionIdSerialize == null) {
                return new Array<Question>(0);
            }
            const questionIds = questionIdSerialize.split(",");
            const questionSize = questionIds.length;
            const ret = new Set<Question>();
            for (let i = 0; i < questionSize; i++) {
                if (questionPersit.contains(questionIds[i])) {
                    const questionDetails = questionPersit.getSome(questionIds[i]);
                    ret.add(questionDetails);
                }
            }
            return ret.values();
        }
        return new Array<Question>(0);
    }

    static set(formId: string, questionId: string): void {
        if (formQuestionPersist.contains(formId)) {
            let questionIdSerialize = formQuestionPersist.getSome(formId);
            if (questionIdSerialize == "" || questionIdSerialize == null) {
                questionIdSerialize = "";
            }
            let questionIds = questionIdSerialize.split(",");
            const fIndex = questionIds.indexOf(questionId);
            if (fIndex == -1) {
                questionIds.push(questionId);
                questionIdSerialize = questionIds.join(",");
                formQuestionPersist.set(formId, questionIdSerialize);
            }
        } else {
            formQuestionPersist.set(formId, questionId);
        }
    }

    static indexOf(formId: string, questionId: string): i32 {
        if (formQuestionPersist.contains(formId)) {
            const questionIdSerialize = formQuestionPersist.getSome(formId);
            if (questionIdSerialize == "" || questionIdSerialize == null) {
                return -1;
            }
            const questionIds = questionIdSerialize.split(",");
            const qIndex = questionIds.indexOf(questionId);
            return qIndex;
        }
        return -1;
    }

    static delete(formId: string, questionId: string): i32 {
        if (formQuestionPersist.contains(formId)) {
            let questionIdSerialize = formQuestionPersist.getSome(formId);
            if (questionIdSerialize == "" || questionIdSerialize == null) {
                questionIdSerialize = "";
            }
            let questionIds = questionIdSerialize.split(",");
            const dIndex = questionIds.indexOf(questionId);
            if (dIndex > -1) {
                questionIds.splice(dIndex, 1);
                questionIdSerialize = questionIds.join(",");
                formQuestionPersist.set(formId, questionIdSerialize);
                return dIndex;
            }
            return -1;
        }
        return -1;
    }
}
