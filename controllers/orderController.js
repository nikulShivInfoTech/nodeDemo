const orderModel = require('../models/orders')
const productModel = require('../models/products')
const mongoose = require('mongoose')
const placeOrder = async (req, res) => {
    console.log("placeOrder API hit");
    const { products, user_id } = req.body;
    try {
        console.log("placeOrder API hit");
        if (!products || !user_id) {
            console.log("Missing required fields");
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        for (const item of products) {
            console.log(`Checking product ID: ${item.product_id}`); // Debug log
            const product = await productModel.findById(item.product_id);
            if (!product) {
                console.log(`Product not found: ${item.product_id}`);
                return res.status(404).json({ success: false, message: `Product with ID ${item.product_id} not found` });
            }
            if (item.quantity > product.countity) {
                console.log(`Insufficient stock for product ID: ${item.product_id}`);
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity (${item.quantity}) exceeds available stock (${product.countity}) for product ${product.product_Name}`
                });
            }
        }

        console.log("Creating order...");
        const newOrder = await orderModel.create({ products, user_id, status: "confirm" });

        for (const item of products) {
            console.log(`Updating stock for product ID: ${item.product_id}`);
            await productModel.findByIdAndUpdate(item.product_id, {
                $inc: { quantity: -item.quantity }
            });
        }

        console.log("Order created successfully");
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });

    } catch (error) {
        console.error("Error in placeOrder:", error.message); // Debug log
        res.status(500).json({
            message: 'Server error',
            error: error.message,
            success: false,
        });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await orderModel.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: 'users', // Join with users collection
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_data'
                }
            },
            {
                $lookup: {
                    from: 'products', // Join with products collection
                    localField: 'products.product_id',
                    foreignField: '_id',
                    as: 'product_data'
                }
            },
            { $unwind: '$user_data' }, // Flatten user data array
            {
                $project: {
                    _id: 1,
                    status: 1,
                    user: {
                        name: '$user_data.name',
                        email: '$user_data.email',
                        role: '$user_data.role'
                    },
                    products: {
                        $map: {
                            input: '$products',
                            as: 'item',
                            in: {
                                product_id: '$$item.product_id',
                                quantity: '$$item.quantity',
                                product_details: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: '$product_data',
                                                as: 'product',
                                                cond: { $eq: ['$$product._id', '$$item.product_id'] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        ]);
        

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        return res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { placeOrder, getOrder }