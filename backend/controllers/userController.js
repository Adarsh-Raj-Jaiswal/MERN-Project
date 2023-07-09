const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register a User 
exports.registerUser = catchAsyncErrors(
    async (req, res, next) => {

        const { name, email, password } = req.body; // extracting from request object

        // creating user
        const user = await User.create(
            {
                name,
                email,
                password,
                avatar: {
                    publid_id: "this is a sample id",
                    url: "profilePicUrl"
                }
            }
        );

        // this method will set status code to 201 creates a token and store it in a cookie and send the user and token as json response
        sendToken(user, 201, res);// it works like user is created and logged in also

    }
);

// Login User
exports.loginUser = catchAsyncErrors(
    async (req, res, next) => {
        const { email, password } = req.body;

        // checking if user has given password and email both
        if (!email || !password) {
            return next(new ErrorHandler('Please enter email and password', 400));
        }

        // finding the user with the email and specifying that we need its password by using select method
        const user = await User.findOne({ email: email }).select('password'); // this will return the user object only containing password

        if (!user) { // user not found
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // validating password
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) { // if password doesn't match
            return next(new ErrorHandler('Invalid email or password', 401));
        }

        // logging in user
        sendToken(user, 200, res);
    }
);

// Logout User
exports.logout = catchAsyncErrors(
    async (req, res, next) => {

        res.cookie('token', null, { // setting the token to null (basically when there is no token in the cookie that means the user is logged out because we use tokens to maintain authentication of users)
            expires: new Date(Date.now()),
            httpOnly: true
        });

        // sending response
        res.status(200).json({
            success: true,
            message: "Logged Out"
        });
    }
);

// Forgot Password
exports.forgotPassword = catchAsyncErrors(
    async (req, res, next) => {
        const user = await User.findOne( // finding user with the email
            {
                email: req.body.email,
            }
        );
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        // Getting ResetPassword Token
        const resetToken = user.getResetPasswordToken();

        // here we are saving the user because getResetPasswordToken() function updates the resetPasswordToken and resetPasswordExpire property of the user document
        await user.save({ validateBeforeSave: false });

        // creating a reset password URL
        const resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

        // creating message to be sent in the email for resetting password
        const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then please ignore it`;

        try {
            // sending the email
            await sendEmail({
                email: user.email,
                subject: 'Ecommerce Password Recovery',
                message,
            });

            // sending the response
            res.status(200).json({
                success: true,
                message: `Email sent to ${user.email} successfully`,
            });

        } catch (error) { // if any error

            // resetting the properties
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            // saving the user after changing the properties
            await user.save({ validateBeforeSave: false });

            return next( // next with error object will trigger the error handling middleware

                new ErrorHandler(error.message, 500) // creating a ErrorHandler object with error message and status code 
            );
        }
    }
);

// Reset Password
exports.resetPassword = catchAsyncErrors(
    async (req, res, next) => {

        // creating token hash
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({ // finding the user with
            resetPasswordToken,// resetPasswordToken matching what we created above and
            resetPasswordExpire: { $gt: Date.now() },// expire should be greater than now (not expired yet)
        });

        if (!user) { // not found or expired
            return next(new ErrorHandler('Reset password token is invalid or has been expired', 400));
        }

        // checking that the user has entered same confirm password as password
        if (req.body.password != req.body.confirmPassword) {
            return next(new ErrorHandler('Password does not match', 400));
        }

        // updating the password
        user.password = req.body.password;
        // setting properties to undefined to make sure that this token is used only once for resetting the password
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        // saving the user with updated password
        await user.save();

        // sending the response and logging in the user with new password
        sendToken(user, 200, res);
    }
);

// Get user details 
exports.getUserDetails = catchAsyncErrors(
    async (req, res, next) => {
        // finding
        const user = await User.findById(req.user.id);

        // sending
        res.status(200).json({
            success: true,
            user,
        });
    }
);

// Update User Password
exports.updatePassword = catchAsyncErrors(
    async (req, res, next) => {
        // finding user with req.user.id and selecting only password
        const user = await User.findById(req.user.id).select('password');

        // checking that the old password entered by the user matches
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

        if (!isPasswordMatched) {
            return next(new ErrorHandler('Old password is incorrect', 400));
        }

        // checking that user has entered same confirm password and new password
        if (req.body.newPassword !== req.body.confirmPassword) {
            return next(new ErrorHandler('Password does not match', 400));
        }

        // updating the password and saving the user
        user.password = req.body.newPassword;
        await user.save();

        // sending response and logging in the user with the updated password
        sendToken(user, 200, res);
    }
);


// Update User Profile
exports.updateProfile = catchAsyncErrors(
    async (req, res, next) => {

        // creating object of new data for updating the user
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        }
        // we will add cloudinary later (for updating avatar)

        // this method will find the user id and update it with new user data
        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        // sending response
        res.status(200).json({
            success: true,
        });
    }
);

// Get all users (admin)
exports.getAllUsers = catchAsyncErrors(
    async (req, res, next) => {
        // getting all users
        const users = await User.find();

        // sending users in json response
        res.status(200).json({
            success: true,
            users
        });
    }
);

// Get single user (admin)
exports.getSingleUser = catchAsyncErrors(
    async (req, res, next) => {
        // finding the user
        const user = await User.findById(req.params.id);

        if (!user) { // not found
            return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400));
        }

        // sending response
        res.status(200).json({
            success: true,
            user
        });
    }
);

// Update User Role (admin)
exports.updateUserRole = catchAsyncErrors(
    async (req, res, next) => {
        // creating object with updated values
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role
        }

        // find and update
        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        if (!user) { // unable to find
            return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400));
        }

        // sending response
        res.status(200).json({
            success: true,
        });
    }
);

// Delete User  (admin)
exports.deleteUser = catchAsyncErrors(
    async (req, res, next) => {
        // finding the user to be deleted
        const user = await User.findById(req.params.id);
        // we will remove cloudinary later

        if (!user) { // not found
            return next(new ErrorHandler(`User does not exist with id: ${req.params.id}`, 400));
        }

        // deleting the user
        await user.deleteOne();

        // sending response
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
);