export declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare class NotFoundError extends HttpError {
    constructor(message?: string);
}
//# sourceMappingURL=HttpError.d.ts.map