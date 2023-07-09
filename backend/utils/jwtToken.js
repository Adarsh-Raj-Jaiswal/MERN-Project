// this function creates token and save it in the cookie
const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken(); // getting the token

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // sending response with json data and adding cookie
    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user,
        token,
    });
};

// exporting
module.exports = sendToken;