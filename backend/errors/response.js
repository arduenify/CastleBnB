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

    toError() {
        const error = new Error(this.message);
        error.statusCode = this.statusCode;

        return error;
    }
}

module.exports = ErrorResponse;
