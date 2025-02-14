const express = require('express')
const multer  = require('multer')
const path = require('path')

const { isAuthenticateSupplier } = require('../controller/supplier')
const { createProduct, getAllProducts, getOneProduct, updateProduct, deleteProduct, getAllProducts1, productBulkUpload } = require('../controller/product')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()

      console.log(file.fieldname)
      cb(null, file.fieldname + '-' +uniqueSuffix +path.extname(file.originalname) )
    }
  })
  
  const upload = multer({ storage: storage })

 
const productRoute = express.Router()

productRoute.post('/productBulk/:supplierID',upload.single('file'),productBulkUpload)
productRoute.post('/product', createProduct)
productRoute.get('/product/:id', getAllProducts)
productRoute.get('/product', getAllProducts1)
productRoute.get('/product1/:id', getOneProduct)
productRoute.put('/product/:id', updateProduct)
productRoute.delete('/product/:id', deleteProduct)

module.exports = productRoute;
