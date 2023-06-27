// this is seperate a route file for defining routes of product


// loading the express module using the require function
const express = require('express');

// performing object destructuring assignment e.i. extracting specific properties from the obect and assign them to the variables with the same name
const { getAllProducts, createProduct } = require('../controllers/productController'); // importing two functions

// creating a new router object
const router = express.Router();

router.route('/Products') // defining routes for /Products path
    .get(getAllProducts); // defining a route for the GET HTTP method


router.route('/Products/new') // defining routes for /Products/new path
    .post(createProduct); // defining a route for the POST HTTP method

// exporting the router object
module.exports = router;