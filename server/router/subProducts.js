const express = require('express');
const router = express.Router();
const {
    createSubproduct,
    getSubProductById,
    getAllSubProducts,
    getSubProductsBySupplierId,
    updateSubProductById,
    deleteSubProducts
} = require('../controller/subProducts');

// Route to create a product
router.post('/createSubProducts', createSubproduct);

// Route to get a single product by ID
router.get('/getOneSubProducts/:id', getSubProductById);

// Route to get all products
router.get('/getAllSubProducts', getAllSubProducts);

// Route to get products by supplier ID
router.get('/getAllSubProducts/:supplierId', getSubProductsBySupplierId);

// Route to update a product by ID
router.put('/updateSubProducts/:id', updateSubProductById);

// Route to delete a product by ID
router.delete('/deleteSubProducts/:id', deleteSubProducts);

module.exports = router;
