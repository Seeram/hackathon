export class HttpError extends Error {
    public status: number;

    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'HttpError';
    }
}

export class NotFoundError extends HttpError {
    constructor(message: string = 'Resource not found') {
        super(404, message);
        this.name = 'NotFoundError';
    }
}
