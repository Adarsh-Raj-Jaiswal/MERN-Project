const Product = require('../models/productModel') // importing the product model
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const ApiFeatures = require('../utils/apiFeatures')

// create product -- Admin
// exporting createProduct function by using exports.
exports.createProduct = catchAsyncErrors(
    async (req, res, next) => {

        req.body.user = req.user.id;

        const product = await Product.create(req.body); // calling the create method (a asynchronous method)of 'Product' model to create new document with the data of req.body (new document matlab ek nayi entry database mai product ki)

        res
            .status(201) // setting status code 201(created)
            .json( // sending a json response
                // creating a js object
                {
                    success: true,
                    product // the product that we created
                }
            )

    }
);

// get all products
exports.getAllProducts = catchAsyncErrors(
    async (req, res) => {

        const resultPerPage = 5;
        const productCount = await Product.countDocuments(); // this will return number of product documents
        const apiFeatute = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagenation(resultPerPage);

        const products = await apiFeatute.query;

        // sending status 200 (ok) and json response
        res.status(200).json({
            success: true,
            products,
            productCount
        });
    }
);

// update product -- Admin
exports.updateProduct = catchAsyncErrors(
    async (req, res, next) => {
        let product = await Product.findById(req.params.id);// searching for the product

        if (!product) {
            return next(new ErrorHandler("Product not found", 500));
        }

        // finding and updating
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        });

        // sending response with the updated product
        res.status(200).json({
            success: true,
            product
        });
    }
);

// Get Product Details 
exports.getProductDetails = catchAsyncErrors(
    async (req, res, next) => {
        // finding the product
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(
                new ErrorHandler("Product Not Found", 404)
            );
        }

        res.status(200).json({ // sending product details in json response
            success: true,
            product
        });
    }
);

// delete product 
exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {
        // finding product
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 500));
        }

        await product.deleteOne(); // this method will delete the product

        // sending response
        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    }
);

// Create new review or Update the review
exports.createProductReview = catchAsyncErrors(
    async (req, res, next) => {

        const { rating, comment, productId } = req.body;// extracting values from req.body object

        // creating review object
        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };
        // finding product
        const product = await Product.findById(productId);

        // checking that the user has created a review or not
        const isReviewed = product.reviews.find( // Returns the value of the first element in the array where predicate is true, and undefined otherwise.

            // predicate
            (rev) => rev.user.toString() === req.user._id.toString() // checking if the user of any review is matched with the user in the req object
        );

        // if already reviewed then update
        if (isReviewed) {
            product.reviews.forEach(
                (rev) => {
                    if (rev.user.toString() === req.user._id.toString()) // finding and updating the user review
                        (rev.rating = rating), (rev.comment = comment); // updating the rating and the comment provided by the user
                }
            );
        }
        // new review
        else {
            product.reviews.push(review); // adding the new review object in the reviews array using push method
            product.numOfReviews = product.reviews.length; // updating the number of reviews
        }

        // calculating the average rating of the product after review
        let avg = 0;
        product.reviews.forEach(
            (rev) => {
                avg += rev.rating;
            }
        );
        product.ratings = avg / product.reviews.length;

        // saving the product with the updated values (review,ratings,numOfReviews)
        await product.save({ validateBeforeSave: false });

        res.status(200).json({ // sending success response
            success: true,
        });
    }
);

// Get All reviews of a Product 
exports.getProductReviews = catchAsyncErrors(
    async (req, res, next) => {
        // finding the product
        const product = await Product.findById(req.query.id);

        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        // sending the reviews array in the response
        res.status(200).json({
            success: true,
            reviews: product.reviews
        });
    }
);

// Delete Review
exports.deleteReview = catchAsyncErrors(
    async (req, res, next) => {
        // finding the product
        const product = await Product.findById(req.query.productId);

        if (!product) {
            return next(new ErrorHandler('Product not found', 404));
        }

        const reviews = product.reviews.filter( // filter method will return all the elements from the array where this condition satisfies
            (rev) => rev._id.toString() !== req.query.id.toString() // this condition will be true on the review which we want to delete
        ); // after this we have array reviews with all the reviews other than which we want to delete

        // recalculating the average rating
        let avg = 0;
        reviews.forEach(
            (rev) => {
                avg += rev.rating;
            }
        );
        const ratings = avg / reviews.length;
        const numOfReviews = reviews.length;

        await Product.findByIdAndUpdate(
            // id to be searched for finding the product to update
            req.query.productId,
            // data to be updated
            {
                reviews,
                ratings,
                numOfReviews,
            },
            // options
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        );

        // sending the response
        res.status(200).json({
            success: true,
        });
    }
);