class ApiError {
    constructor({ statusCode, message, errors }) {
        this.statusCode = statusCode;
        this.message = message;

        if (errors) this.errors = errors;
    }

    /**
     * Converts the error to a response object
     * @returns {Object} - The error response
     */
    toErrorResponse() {
        const response = {
            message: this.message,
            statusCode: this.statusCode,
        };

        if (this.errors && this.errors.length) {
            response.errors = this.errors;
        }

        return response;
    }

    // Maybe not correct because it couples the error response with the response object
    // but it's convenient.
    // todo: maybe remove this method
    send(res) {
        res.status(this.statusCode).json(this.toErrorResponse());
    }
}

/**
 * All error types will go here
 */

class BadRequestError extends ApiError {
    constructor({ message = 'Bad request' } = {}) {
        super({ statusCode: 400, message });
    }
}

class SequelizeValidationError extends ApiError {
    constructor({ errors } = {}) {
        super({ statusCode: 400, message: 'Validation error', errors });
    }
}

class AuthenticationError extends ApiError {
    constructor({ message = 'Authentication required' } = {}) {
        super({ statusCode: 401, message });
    }
}

class ForbiddenError extends ApiError {
    constructor({ message = 'Forbidden', errors } = {}) {
        super({ statusCode: 403, message, errors });
    }
}

class InternalServerError extends ApiError {
    constructor({ message = 'Internal server error' } = {}) {
        super({ statusCode: 500, message });
    }
}

class ResourceNotFoundError extends ApiError {
    constructor({ message = 'Resource not found' } = {}) {
        super({ statusCode: 404, message });
    }
}

module.exports = {
    ApiError,
    BadRequestError,
    SequelizeValidationError,
    AuthenticationError,
    ForbiddenError,
    InternalServerError,
    ResourceNotFoundError,
};
