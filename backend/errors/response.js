class ErrorResponse {
    constructor(statusCode, message, title) {
        this.statusCode = statusCode;
        this.message = message;
        this.title = title;
    }

    toJSON() {
        const response = {
            statusCode: this.statusCode,
            message: this.message,
        };

        if (this.title) {
            response.title = this.title;
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
