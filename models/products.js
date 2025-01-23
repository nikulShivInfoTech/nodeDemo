const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_Name: {
    type: String,
    required: [true, 'Product name is required'],
    minlength: [3, 'Product name must be at least 3 characters long'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    match: [/^\d+(\.\d{1,2})?$/, 'Please enter a valid price format'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    max: [1000, 'Quantity cannot exceed 1000'],
  },
  fileUrl: {
    images: { type: [String], default: [] }, // Default to an empty array
    videos: { type: [String], default: [] }, // Default to an empty array
  },
});

const productModel = mongoose.model('product', productSchema);

module.exports = productModel;
