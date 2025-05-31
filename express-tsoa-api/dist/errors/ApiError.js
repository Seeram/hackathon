"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.BadRequestError = exports.NotFoundError = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(404, message);
        this.name = 'NotFoundError';
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
        super(400, message);
        this.name = 'BadRequestError';
    }
}
exports.BadRequestError = BadRequestError;
class InternalServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(500, message);
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=ApiError.js.map