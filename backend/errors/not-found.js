class ResourceNotFoundError extends ErrorResponse {
    constructor(message) {
        super(404, message);
    }
}

module.exports = ResourceNotFoundError;
