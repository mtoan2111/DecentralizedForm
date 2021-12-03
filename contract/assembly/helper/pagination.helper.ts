import { logging } from "near-sdk-core";

const PAGE_SIZE = 5;

@nearBindgen
export class PaginationResult<T> {
    constructor(public page: i32, public total: i32, public data: T[]) {}
}

export function pagination<T>(args: T[], page: i32): PaginationResult<T> {
    //by default minimum page = 1
    if (page < 1) {
        page = 1;
    }

    let maxPage = 0;
    if (args.length % PAGE_SIZE === 0) {
        maxPage = args.length / PAGE_SIZE;
    } else {
        maxPage = floor(args.length / PAGE_SIZE) + 1;
    }

    if (page > maxPage) {
        page = max(1, maxPage);
    }

    const startIndex = min(args.length - 1, args.length - (page - 1) * PAGE_SIZE - 1);
    const endIndex = max(0, startIndex - PAGE_SIZE + 1);

    logging.log(args.length);
    logging.log(startIndex);
    logging.log(endIndex);

    let resultDatas = new Set<T>();
    for (let i = startIndex; i >= endIndex; i--) {
        logging.log(i);
        resultDatas.add(args[i]);
    }
    return new PaginationResult(page, args.length, resultDatas.values());
}
