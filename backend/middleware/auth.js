const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// this method is used to check that the user is logged in 
exports.isAuthenticatedUser = catchAsyncErrors(
    async (req, res, next) => {
        const { token } = req.cookies;

        if (!token) {
            return next(new ErrorHandler('Please login to access this resource', 401));
        }

        //verifying and decoding JWT using the secret key or public key. It allows you to validate the JWT and retrieve the original payload.
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decodedData.id); // finding the user with the id that is retrieved from the jwt
        next();
    }
);

// this method is used to authorize different user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {

        if (!roles.includes(req.user.role)) { // if user does not have any of the roles in the ...roles array
            return next(
                new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403)
            );
        }

        // if the role of user is specified in the array then continue to next middleware
        next();
    };
};