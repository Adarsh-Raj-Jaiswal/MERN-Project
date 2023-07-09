// this file is used to define the model for user

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // built in module no need to install additionally

// creating schema for user
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        maxLength: [30, "Your name cannot exceed 30 characters"],
        minLength: [4, "Name should contain atleast 4 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        // using validator to validate the email
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password should contain atleast 8 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            require: true
        },
        url: {
            type: String,
            require: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

userSchema.pre('save',// defines a pre-hook for the 'save' event in the userSchema.

    // this callback function will be called before every save event in the document
    async function (next) {

        // donot hash password if password is not modified
        if (!this.isModified('password')) {
            next();
        }
        // hashing the modified password (we do not store the password we hash it and then store)
        this.password = await bcrypt.hash(this.password, 10);
    });


// userSchema.methods is used to define instance methods for the document. Inside the method, this refers to the document instance itself. Note that instance methods defined using methods are not available on the model itself or as static methods.

//JWT TOKEN
userSchema.methods.getJWTToken = function () {

    // this method is used to generate a json web token
    return jwt.sign(
        //The jwt.sign() function returns a JWT as a string. The generated token is a compact string representation that consists of three parts: the header, payload, and signature. The token can be used to authenticate and authorize requests from clients.

        // payload (This is an object containing the data you want to include in the JWT)
        { id: this._id },

        // secretKey(This is a secret or private key used to sign the JWT.)
        process.env.JWT_SECRET,

        // options
        {
            expiresIn: process.env.JWT_EXPIRE,
        }
    );
};

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {

    // this method is used to compare the entered password with the hashed password of the document
    return await bcrypt.compare(enteredPassword, this.password);
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {

    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Hashing and adding to userSchema
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

module.exports = mongoose.model('User', userSchema); // creating 'User' model with 'userSchema' schema