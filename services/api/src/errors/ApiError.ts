export class ApiError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'ApiError';
    }
}

export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super(404, message);
        this.name = 'NotFoundError';
    }
}

export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad request') {
        super(400, message);
        this.name = 'BadRequestError';
    }
}

export class InternalServerError extends ApiError {
    constructor(message: string = 'Internal server error') {
        super(500, message);
        this.name = 'InternalServerError';
    }
}
