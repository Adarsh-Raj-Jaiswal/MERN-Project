// importing our custom error handling class
const ErrorHandler = require('../utils/errorHandler');

module.exports =

    // error handling middleware function
    (err, req, res, next) => {

        // this is for when all the if conditions are bypassed
        err.statusCode = err.statusCode || 500; // 500(Internal server error)
        err.message = err.message || "Internal server error";


        // wrong MongodbId error - cast error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;

            // passing error to the error class
            err = new ErrorHandler(message, 400); // 400 (Bad request)
        }

        // Mongoose duplicate key error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
            err = new ErrorHandler(message, 400);
        }

        // Wrong JWT error
        if (err.name === 'JsonWebTokenError') {
            const message = 'Json Web Token is invalid, try again';
            err = new ErrorHandler(message, 400);
        }

        // JWT Expire error
        if (err.name === 'TokenExpiredError') {
            const message = 'Json Web Token is Expired, try again';
            err = new ErrorHandler(message, 400);
        }

        // sending response
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    };