// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controller/employeeOrder');

// Create a new order
router.post('/createOrder', orderController.createOrder);

router.post('/capturePayment',orderController.capturePayment)

// Get all orders
router.get('/orders', orderController.getAllOrders);

// Get one order by ID
router.get('/orders/:id', orderController.getOrderById);

// Get one order by ID
router.get('/ordersEmployee/:id', orderController.getOrdersByEmployeeId);

//get supplier orders
router.get('/orders/supplier/:supplierId', orderController.getOrdersBySupplierId);

// Update an order by ID
router.put('/orders/:id', orderController.updateOrder);

// Delete an order by ID
router.delete('/orders/:id', orderController.deleteOrder);

module.exports = router;
