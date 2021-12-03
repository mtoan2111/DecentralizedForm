import { PersistentUnorderedMap, logging } from "near-sdk-as";
import { UserAnswer } from "../model/answer.model";
import { QuestionStorage } from "./question.storage";

const participantAnswerFormPersit = new PersistentUnorderedMap<string, string>("uAFP");
const answerFormPersist = new PersistentUnorderedMap<string, string>("aFP");
const answerPersit = new PersistentUnorderedMap<string, string>("aP");

export class AnswerStorage {
    static get(formId: string, userId: string): UserAnswer[] {
        const apId = `${userId}_${formId}`;
        if (answerFormPersist.contains(apId)) {
            const anwStringify = answerFormPersist.getSome(apId);
            const anws = anwStringify.split(";");
            const anws_length = anws.length;
            const ret: Set<UserAnswer> = new Set<UserAnswer>();
            for (let i = 0; i < anws_length; i++) {
                const anw = anws[i].split(":");
                if (anw.length == 2) {
                    const question_id = anw[0];
                    const question_detail = QuestionStorage.get(question_id);
                    if (question_detail == null) {
                        continue;
                    }
                    const answer = anw[1];
                    ret.add(new UserAnswer(question_id, question_detail.getTitle(), question_detail.getType(), answer));
                }
            }
            return ret.values();
        }

        return new Array<UserAnswer>(0);
    }

    static set(formId: string, userId: string, questionId: string, answer: string): void {
        const apId = `${userId}_${formId}`;
        if (answerFormPersist.contains(apId)) {
            let anwStringify = answerFormPersist.getSome(apId);
            const anws = anwStringify.split(";");
            const new_anws = `${questionId}:${answer}`;
            anws.push(new_anws);
            anwStringify = anws.join(";");
            answerFormPersist.set(apId, anwStringify);
        } else {
            const new_anws = `${questionId}:${answer}`;
            answerFormPersist.set(apId, new_anws);
        }
    }

    static delete(formId: string, userId: string, questionId: string): void {
        const apId = `${userId}_${formId}`;
        if (answerFormPersist.contains(apId)) {
            let anwStringify = answerFormPersist.getSome(apId);
            const anws = anwStringify.split(";");
            const anws_length = anws.length;
            let qIndex = -1;
            for (let i = 0; i < anws_length; i++) {
                const anw = anws[i].split(":");
                if (anw.length == 2 && questionId == anw[0]) {
                    qIndex = i;
                    break;
                }
            }

            if (qIndex != -1) {
                anws.splice(qIndex, 1);
                anwStringify = anws.join(";");
                answerFormPersist.set(apId, anwStringify);
            }
        }
    }

    // static gets(): Question[] {
    //     return questionPersit.values();
    // }

    // static contains(id: string): bool {
    //     return questionPersit.contains(id);
    // }

    // static delete(id: string): void {
    //     questionPersit.delete(id);
    // }
}

// export class ParticipantAnswerFormStorage {
//     static get(formId: string, userId: string): Answer[] {
//         if (participantAnswerFormPersit.contains(formId)) {
//             const participantIdsSerialize = participantAnswerFormPersit.getSome(formId);
//             const
//         }
//     }
// }
