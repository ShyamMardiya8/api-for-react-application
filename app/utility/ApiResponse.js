class ApiResponse {
    constructor(statusCode, message, data = null) {
        this.success = statusCode >= 200 && statusCode < 300; // true for 2xx
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
    }
}

module.exports = ApiResponse