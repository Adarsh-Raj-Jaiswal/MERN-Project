const Product = require('../models/productModel') // importing the product model

// create product -- Admin

// exporting createProduct function by using exports.
exports.createProduct = async (req, res, next) => {

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

// get all products
exports.getAllProducts = async (req, res) => {

    const products = await Product.find(); // the find method retreive documents from the database matching certain criteria, but in this case it will return all the documents(all the products)

    // sending status 200 (ok) and json response
    res.status(200).json({
        success: true,
        products
    });
}


// update product -- Admin
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
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



// delete product 

exports.deleteProduct = async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(500).json({
            success: false,
            message: "Product not found"
        })
    }

    await product.deleteOne();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
}