const orderModel = require('../models/orders')
const productModel = require('../models/products')
const mongoose = require('mongoose')
const placeOrder = async (req, res) => {

    const { products, user_id } = req.body;
    try {
        if (!products || !user_id) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        for (const item of products) {
            const product = await productModel.findById(item.product_id);
            if (!product) {
                return res.status(404).json({ success: false, message: `Product with ID ${item.product_id} not found` });
            }
            if (item.quantity > product.countity) {
                return res.status(400).json({
                    success: false,
                    message: `Requested quantity (${item.quantity}) exceeds available stock (${product.countity}) for product ${product.product_Name}`
                });
            }
        }

        const newOrder = await orderModel.create({ products, user_id, status: "confirm" });

        for (const item of products) {
            await productModel.findByIdAndUpdate(item.product_id, {
                $inc: { quantity: -item.quantity }
            });
        }
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: newOrder
        });

    } catch (error) {
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

        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { placeOrder, getOrder }