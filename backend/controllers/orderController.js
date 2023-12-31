const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');

// create order
exports.newOrder = catchAsyncErrors(
    async (req, res, next) => {
        const {
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice
        } = req.body;

        const order = await Order.create({
            shippingInfo,
            orderItems,
            paymentInfo,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
            paidAt: Date.now(),
            user: req.user._id
        });

        res.status(201).json({
            success: true,
            order
        });
    }
);
// Get Single Order
exports.getSingleOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id).populate('user', 'name email'); // populate method will populate the user property with name and email of the user form the user database by using user id to find it

        if (!order) {
            return next(new ErrorHandler('Order not found with this id', 404));
        }

        res.status(200).json({
            success: true,
            order
        });
    }
);
// Get logged in user Orders
exports.myOrders = catchAsyncErrors(
    async (req, res, next) => {
        const orders = await Order.find(
            // filter
            { user: req.user._id }
        )

        res.status(200).json({
            success: true,
            orders
        });
    }
);
// Get all Orders --Admin
exports.getAllOrders = catchAsyncErrors(
    async (req, res, next) => {
        const orders = await Order.find();

        let totalAmount = 0;

        orders.forEach(order => totalAmount += order.totalPrice);

        res.status(200).json({
            success: true,
            totalAmount,
            orders
        });
    }
);
// Update Order Status --Admin
exports.updateOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return next(new ErrorHandler('Order not found with this id', 400));
        }

        if (order.orderStatus === 'Delivered') {
            return next(new ErrorHandler('You have already delivered this order', 400));
        }

        order.orderItems.forEach(async (o) => {
            await updateStock(o.product, o.quantity);
        });

        order.orderStatus = req.body.status;

        if (req.body.status === 'Delivered') {
            order.deliveredAt = Date.now();
        }
        await order.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
        });
    }
);

async function updateStock(id, quantity) {
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({ validateBeforeSave: false });
}
// Delete Order --Admin
exports.deleteOrder = catchAsyncErrors(
    async (req, res, next) => {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorHandler('Order not found with this id', 400));
        }
        await order.deleteOne();

        res.status(200).json({
            success: true,
        });
    }
)