// creating custom error handling class by extending the Error class
class ErrorHandler extends Error {
    constructor
        (
            message, // message parameter represents the error message
            statusCode // statusCode parameter represents the HTTP status code associated with the error
        ) {
        super(message); //  the message parameter is passed to the Error class's constructor, which sets the error message for the error instance.

        this.statusCode = statusCode; // parameter is assigned to the this.property

        Error.captureStackTrace(this, this.constructor); // captures the stack trace for the error instance, which provides information about where the error was instantiated in the code.
    }
};
// exporting error class
module.exports = ErrorHandler;