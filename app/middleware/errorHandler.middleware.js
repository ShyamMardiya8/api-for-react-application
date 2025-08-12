function errorHandler(err, req, res, next) {
    console.error(err)

    const statusCode = err.statusCode || 500

    return res.status(statusCode).json({
        success : false,
        statusCode,
        error : err.name || "InternalServerError",
        message: err.message || "Something went wrong"
    })
    
}

module.exports = errorHandler