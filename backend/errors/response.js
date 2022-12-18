class ErrorResponse {
    constructor(statusCode, message, title) {
        this.statusCode = statusCode;
        this.message = message;

        if (title) this.title = title;
    }

    toJSON() {
        const response = {
            message: this.message,
            statusCode: this.statusCode,
        };

        if (this.title) {
            response.title = this.title;
        }

        if (this.errors) {
            response.errors = this.errors;
        }

        return response;
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
