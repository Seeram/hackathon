export declare class ApiError extends Error {
    status: number;
    constructor(status: number, message: string);
}
export declare class NotFoundError extends ApiError {
    constructor(message?: string);
}
export declare class BadRequestError extends ApiError {
    constructor(message?: string);
}
export declare class InternalServerError extends ApiError {
    constructor(message?: string);
}
//# sourceMappingURL=ApiError.d.ts.map