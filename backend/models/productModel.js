// loading the mongoose module using the require function
const mongoose = require('mongoose');



const productSchema = new mongoose.Schema( // this function is used to create a new schema
    // defining a schema
    {
        name: {
            type: String,
            required: [true, "Please enter product name"],
            trim: true
        },
        description: {
            type: String,
            required: [true, "Please enter product description"]
        },
        price: {
            type: Number,
            required: [true, "Please enter product price"],
            maxLength: [8, "Price cannot exceed 8 characters"]
        },
        rating: {
            type: Number,
            default: 0
        },
        images: [
            {
                public_id: {
                    type: String,
                    require: true
                },
                url: {
                    type: String,
                    require: true
                }
            }
        ],
        category: {
            type: String,
            required: [true, "Please enter the product category"]
        },
        stock: {
            type: Number,
            required: [true, "Please enter product stock"],
            maxLength: [4, "Stock cannot exceed 4 characters"],
            default: 1
        },
        numOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

// The model is a class that provides an interface to interact with the MongoDB collection associated with the schema.With the model, we can perform various operations on the associated collection, such as creating, reading, updating, and deleting documents.

// Note that the schema defines the structure and validations for the documents, while the model provides an interface to interact with the collection based on the schema.


// creating a "Product" model based on productSchema schema
module.exports = mongoose.model("Product", productSchema); // this method is used to create a model