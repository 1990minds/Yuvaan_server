const express = require('express');
const router = express.Router();
const {
    createSpecialProduct,
    getProductById,
    getAllProducts,
    getProductsBySupplierId,
    updateProductById,
    deleteProductById
} = require('../controller/specialProduct');

// Route to create a product
router.post('/createSpecialProducts', createSpecialProduct);

// Route to get a single product by ID
router.get('/getOneSpecialProducts/:id', getProductById);

// Route to get all products
router.get('/getAllSpecialProducts', getAllProducts);

// Route to get products by supplier ID
router.get('/getAllSpecialProducts/:supplierId', getProductsBySupplierId);

// Route to update a product by ID
router.put('/updateSpecialProducts/:id', updateProductById);

// Route to delete a product by ID
router.delete('/deleteSpecialProducts/:id', deleteProductById);

module.exports = router;
