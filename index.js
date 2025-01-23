const express = require('express');
const mongoDb =require('./db');
const path = require('path');
const app = express();
const userRegister= require('./routes/userRoutes')
const product=require('./routes/productRoutes')
const order=require('./routes/orderRoutes')
require('dotenv').config();
app.use(express.json());
app.use('/api/user',userRegister);
app.use('/api/product',product);
app.use("/api/order",order);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
mongoDb();
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on port ${port}...`);
});
