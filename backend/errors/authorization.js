const ErrorResponse = require('./response');

class AuthorizationError extends ErrorResponse {
    constructor(message = 'Forbidden') {
        super(403, message);
    }
}

module.exports = AuthorizationError;
