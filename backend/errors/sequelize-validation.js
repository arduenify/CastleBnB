const ErrorResponse = require('./response');

class SequelizeValidationError extends ErrorResponse {
    constructor(errors) {
        super(400, 'Validation error');

        this.errors = errors;
    }
}

module.exports = SequelizeValidationError;
