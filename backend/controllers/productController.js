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
        const productCount = await Product.countDocuments();
        const apiFeatute = new ApiFeatures(Product.find(), req.query)
            .search()
            .filter()
            .pagenation(resultPerPage);

        const products = await apiFeatute.query; // the find method retreive documents from the database matching certain criteria, but in this case it will return all the documents(all the products)

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
        let product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 500));
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).json({
            success: true,
            product
        })
    }
);
// Get Product Details 

exports.getProductDetails = catchAsyncErrors(
    async (req, res, next) => {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(
                new ErrorHandler("Product Not Found", 404)
            );
        }

        res.status(200).json({
            success: true,
            product
        });

    }
);

// delete product 

exports.deleteProduct = catchAsyncErrors(
    async (req, res, next) => {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorHandler("Product not found", 500));
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        })
    }
);