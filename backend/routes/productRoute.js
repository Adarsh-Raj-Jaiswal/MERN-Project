// this is seperate a route file for defining routes of product


// loading the express module using the require function
const express = require('express');

// performing object destructuring assignment e.i. extracting specific properties from the obect and assign them to the variables with the same name
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController'); // importing  functions
const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

// creating a new router object
const router = express.Router();

router.route('/products') // defining routes for /Products path
    .get(getAllProducts); // defining a route for the GET HTTP method providing getAllProducts as callback function


router.route('/admin/product/new') // defining routes for /Products/new path
    .post(isAuthenticatedUser, authorizeRoles('admin'), createProduct); // defining a route for the POST HTTP method providing createProduct as callback function

router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router.route('/product/:id').get(getProductDetails);

router.route('/review').put(isAuthenticatedUser, createProductReview);

router.route('/reviews')
    .get(getProductReviews)
    .delete(isAuthenticatedUser,deleteReview);

// exporting the router object
module.exports = router;