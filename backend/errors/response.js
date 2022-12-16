class ErrorResponse {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    toJSON() {
        return {
            statusCode: this.statusCode,
            message: this.message,
        };
    }

    // Maybe not correct because it couples the error response with the response object
    // but it's convenient
    send(res) {
        res.status(this.statusCode).json(this.toJSON());
    }

    toError() {
        const error = new Error(this.message);
        error.statusCode = this.statusCode;

        return error;
    }
}

module.exports = ErrorResponse;
