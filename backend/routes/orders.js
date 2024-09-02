const { Order } = require('../models/order');
const express = require('express');
const { OrderItem } = require('../models/order-item');
const router = express.Router();

// Route to get a list of all orders
router.get(`/`, async (req, res) => {
    try {
        // Retrieve all orders, populate user details and sort by dateOrdered in descending order
        const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});
        
        // Check if orders were retrieved
        if (!orderList) {
            return res.status(500).json({ success: false });
        }

        // Respond with the list of orders
        res.send(orderList);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get a specific order by ID
router.get(`/:id`, async (req, res) => {
    try {
        // Find the order by ID and populate user and orderItems details
        const order = await Order.findById(req.params.id)
            .populate('user', 'name')
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            });

        // Check if the order was not found
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Respond with the order details
        res.send(order);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to create a new order
router.post('/', async (req, res) => {
    try {
        // Create order items and save them, then collect their IDs
        const orderItemsIds = await Promise.all(req.body.orderItems.map(async (orderItem) => {
            let newOrderItem = new OrderItem({
                quantity: orderItem.quantity,
                product: orderItem.product
            });

            newOrderItem = await newOrderItem.save();
            return newOrderItem._id;
        }));

        // Calculate total price of the order
        const totalPrices = await Promise.all(orderItemsIds.map(async (orderItemId) => {
            const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
            return orderItem.product.price * orderItem.quantity;
        }));

        const totalPrice = totalPrices.reduce((a, b) => a + b, 0);

        // Create a new order with the calculated total price and other details
        let order = new Order({
            orderItems: orderItemsIds,
            shippingAddress1: req.body.shippingAddress1,
            shippingAddress2: req.body.shippingAddress2,
            city: req.body.city,
            zip: req.body.zip,
            country: req.body.country,
            phone: req.body.phone,
            status: req.body.status,
            totalPrice: totalPrice,
            user: req.body.user,
        });

        order = await order.save();

        // Respond with the newly created order
        res.status(201).send(order);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).send('Internal Server Error');
    }
});

// Route to update an existing order by ID
router.put('/:id', async (req, res) => {
    try {
        // Update the order status
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        // Check if the order was not updated
        if (!order) return res.status(400).send('The order cannot be updated!');

        // Respond with the updated order
        res.send(order);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to delete an order by ID
router.delete('/:id', async (req, res) => {
    try {
        // Find and remove the order
        const order = await Order.findByIdAndRemove(req.params.id);

        // Check if the order was found and deleted
        if (order) {
            // Remove associated order items
            await Promise.all(order.orderItems.map(async (orderItem) => {
                await OrderItem.findByIdAndRemove(orderItem);
            }));
            return res.status(200).json({ success: true, message: 'The order is deleted!' });
        } else {
            return res.status(404).json({ success: false, message: 'Order not found!' });
        }
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get the total sales amount
router.get('/get/totalsales', async (req, res) => {
    try {
        // Aggregate total sales from all orders
        const totalSales = await Order.aggregate([
            { $group: { _id: null, totalsales: { $sum: '$totalPrice' } } }
        ]);

        // Check if total sales were retrieved
        if (!totalSales) {
            return res.status(400).send('The order sales cannot be generated');
        }

        // Respond with the total sales amount
        res.send({ totalsales: totalSales.pop().totalsales });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get the count of all orders
router.get(`/get/count`, async (req, res) => {
    try {
        // Count the total number of orders
        const orderCount = await Order.countDocuments();

        // Respond with the order count
        res.send({ orderCount: orderCount });
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

// Route to get all orders for a specific user
router.get(`/get/userorders/:userid`, async (req, res) => {
    try {
        // Retrieve orders for a specific user, populate orderItems and product details, and sort by dateOrdered
        const userOrderList = await Order.find({ user: req.params.userid })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'product',
                    populate: 'category'
                }
            })
            .sort({'dateOrdered': -1});

        // Check if user orders were retrieved
        if (!userOrderList) {
            return res.status(500).json({ success: false });
        }

        // Respond with the list of user orders
        res.send(userOrderList);
    } catch (error) {
        // Handle unexpected errors
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
