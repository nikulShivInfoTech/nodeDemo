const productModel = require('../models/products');

const product = async (req, res) => {
  try {
    const { price, product_Name, quantity } = req.body;

    // Initialize arrays for images and videos
    let images = [];
    let videos = [];

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        if (file.mimetype.startsWith('image/')) {
          images.push(`/uploads/${file.filename}`);
        } else if (file.mimetype.startsWith('video/')) {
          videos.push(`/uploads/${file.filename}`);
        }
      });
    }

    // Create a new product with the provided data
    const newProduct = new productModel({
      price,
      product_Name,
      quantity,
      fileUrl: {
        images: images.length > 0 ? images : undefined, // Include only if images exist
        videos: videos.length > 0 ? videos : undefined, // Include only if videos exist
      },
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: {
        id: savedProduct._id,
        product_Name: savedProduct.product_Name,
        price: savedProduct.price,
        quantity: savedProduct.quantity,
        fileUrl: savedProduct.fileUrl,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((e) => e.message);

      return res.status(400).json({
        message: 'Validation error',
        errors: validationErrors,
      });
    }
    res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = { product };
