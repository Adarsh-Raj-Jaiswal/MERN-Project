// this is seperate a route file for defining routes of product

// loading the express module using the require function
const express = require('express');

// performing object destructuring assignment e.i. extracting specific properties from the object and assign them to the variables with the same name
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteReview
} = require('../controllers/productController'); // importing  functions for product routes

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth'); // importing functions for authorization on routes

// creating a new router object
const router = express.Router();

router.route('/products') // defining routes for /Products path
    .get(getAllProducts); // defining a route for the GET HTTP method providing getAllProducts as callback function, anyone can access this route even if it is not logged in


router.route('/admin/product/new') // defining admin routes for /Products/new path
    .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct); // defining a route for the POST HTTP method providing createProduct as callback function, the user must be logged in and role should be admin

router.route('/admin/product/:id') // route for update and delete product, user should be logged in and role should be admin
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/product/:id').get(getProductDetails); // product details can also be accessed without logging in

router.route('/review').put(isAuthenticatedUser, createProductReview); // route for creating a product review, user must be logged in to be able to create a review

router.route('/reviews')
    .get(getProductReviews) // product reviews can be accessed without logging in
    .delete(isAuthenticatedUser, deleteReview); // you need to loggin to delete your review

// exporting the router object
module.exports = router;