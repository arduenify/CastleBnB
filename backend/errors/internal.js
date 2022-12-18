const ErrorResponse = require('./response');

class InternalServerError extends ErrorResponse {
    constructor(
        title = 'Internal server error',
        message = 'Something went wrong.'
    ) {
        super(500, message, title);
    }
}

module.exports = InternalServerError;
