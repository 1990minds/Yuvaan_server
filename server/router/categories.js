const express = require('express');
const { createCategory, getAllCtegories, getAllCategories1, getOne, updateCategory, deleteCategory } = require('../controller/categories');
const { isAuthenticateSupplier } = require('../controller/supplier');



const categoryRoute = express.Router()







categoryRoute.post('/category',isAuthenticateSupplier,createCategory)
categoryRoute.get('/category1/:id',isAuthenticateSupplier, getAllCtegories)
categoryRoute.get('/category',isAuthenticateSupplier, getAllCategories1)
categoryRoute.get('/category/:id',isAuthenticateSupplier, getOne)
categoryRoute.put('/category/:id',isAuthenticateSupplier, updateCategory)
categoryRoute.delete('/category/:id',isAuthenticateSupplier, deleteCategory)

module.exports = categoryRoute;
