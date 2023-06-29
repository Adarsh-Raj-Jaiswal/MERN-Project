// the app.js file is used as a central file for configuring and setting up an Express.js application


// loading the express module using the require function
const express = require('express');

// creating an instance of the Express application
const app = express();

const errorMiddleware = require('./middleware/error')

// this method is used to add middleware
app.use(
    express.json() // parses the JSON data from incoming request and populates the req.body property with JSON object
);


// loading Router from the productRoute.js file
const product = require('./routes/productRoute');


// adding a path specific middleware -> app.use([path],middleware)
app.use('/api/v1', product); // mounting the router(product) on a specific route path

// Middleware for errors
app.use(errorMiddleware);

// exporting the app instance
module.exports = app;