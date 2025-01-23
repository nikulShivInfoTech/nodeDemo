const express = require('express');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/multer.middleware');
const { product } = require('../controllers/productController');

const router = express.Router();

router.post('/addProduct', auth('admin'), upload.any(), product);

module.exports = router;
