const ErrorResponse = require('./response');

class AuthenticationError extends ErrorResponse {
    constructor(message = 'Authentication required') {
        super(401, message);
    }
}

module.exports = AuthenticationError;
