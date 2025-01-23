const express=require('express');

const router=express.Router();

const {auth}=require('../middleware/auth');

const {placeOrder,getOrder}=require('../controllers/orderController');

router.post('/placeOrder',auth(),placeOrder);

router.get('/getOrder/:id',auth(),getOrder);

module.exports=router
