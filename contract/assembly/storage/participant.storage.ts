import { logging, PersistentUnorderedMap } from "near-sdk-core";

const participantAnswerIndexPersist = new PersistentUnorderedMap<string, string>("uAIP");

export class ParticipantAnswerIndexStorage {
    static get(userId: string, formId: string): i32 {
        if (participantAnswerIndexPersist.contains(userId)) {
            const answerIndexStringify = participantAnswerIndexPersist.getSome(userId);
            if (answerIndexStringify == null || answerIndexStringify == "") {
                return -1;
            }

            const answerIndexs = answerIndexStringify.split(";");
            const answerIndexsLength = answerIndexs.length;
            for (let i = 0; i < answerIndexsLength; i++) {
                const formIndex = answerIndexs[i].split(":");
                if (formIndex.length == 2 && formIndex[0] == formId) {
                    return i32(parseInt(formIndex[1]));
                }
            }
        }
        return -1;
    }

    static set(userId: string, formId: string, index: i32): void {
        if (participantAnswerIndexPersist.contains(userId)) {
            let answerIndexStringify = participantAnswerIndexPersist.getSome(userId);
            if (answerIndexStringify == null || answerIndexStringify == "") {
                answerIndexStringify = "";
            }

            const answerIndexs = answerIndexStringify.split(";");
            const answerIndexsLength = answerIndexs.length;
            let fIndex = -1;
            for (let i = 0; i < answerIndexsLength; i++) {
                const formIndex = answerIndexs[i].split(":");
                if (formIndex.length == 2 && formIndex[0] == formId) {
                    fIndex = i;
                }
            }

            if (fIndex == -1) {
                answerIndexs.push(`${formId}:${index}`);
            } else {
                answerIndexs[fIndex] = `${formId}:${index}`;
            }

            answerIndexStringify = answerIndexs.join(";");

            participantAnswerIndexPersist.set(userId, answerIndexStringify);
        } else {
            participantAnswerIndexPersist.set(userId, `${formId}:${index}`);
        }
    }
}