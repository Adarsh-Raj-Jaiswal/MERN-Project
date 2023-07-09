// this is seperate a route file for defining routes of user

const express = require('express');

const {
    registerUser,
    loginUser,
    logout,
    forgotPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getAllUsers,
    getSingleUser,
    updateUserRole,
    deleteUser
} = require('../controllers/userController'); // importing functions

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth'); // for authorization

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

router.route('/password/forgot').post(forgotPassword);

router.route('/password/reset/:token').put(resetPassword);

router.route('/logout').get(logout);

router.route('/me').get(isAuthenticatedUser, getUserDetails); // logged in

router.route('/password/update').put(isAuthenticatedUser, updatePassword); // logged in

router.route('/me/update').put(isAuthenticatedUser, updateProfile); // logged in

// admin route get all users
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);

// admin route for getting, updating and deleting a single user
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router; 