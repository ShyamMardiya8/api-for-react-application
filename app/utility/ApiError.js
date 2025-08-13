class ApiError extends Error {
    constructor(statusCode, message){
        super(message)
        this.statusCode = statusCode;
        this.name = this.constructor.name
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ApiError;

class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.success = statusCode >= 200 && statusCode < 300; // true for 2xx
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse;
