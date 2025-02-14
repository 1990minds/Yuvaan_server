

const express = require('express')
const multer  = require('multer')
const path = require('path')
const {isAuthenticateAdmin} = require('../controller/admin')
const {isAuthenticateUser} = require('../controller/user')



const { createSupplier,login,isAuthenticateSupplier,supplierProfile, updateSupplier, getAllSupplier, getOneSupplier,deleteSupplier, updateSupplierTour} = require('../controller/supplier')






const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null, file.fieldname + '-' +uniqueSuffix +path.extname(file.originalname) )
    }
  })
  
  const upload = multer({ storage: storage })


const router = express.Router()
router.post('/supplier',isAuthenticateAdmin,createSupplier)
router.post('/supplierAuth', login)
router.get('/supplierProfile',isAuthenticateSupplier,supplierProfile)
router.put('/supplier/:id',isAuthenticateAdmin,updateSupplier)
router.get('/getsupplierAdmin',isAuthenticateAdmin,getAllSupplier)
router.get('/supplier4/:id',isAuthenticateAdmin,getOneSupplier)
router.get('/supplier2/:id',isAuthenticateSupplier,getOneSupplier)
router.put('/supplier3/:id',isAuthenticateSupplier,updateSupplier)
router.put('/supplierTour/:id',isAuthenticateSupplier,updateSupplierTour)

router.delete('/supplier/:id',isAuthenticateAdmin,deleteSupplier)

router.post('/supplieruser1',isAuthenticateUser,createSupplier)
router.put('/supplieruser/:id',isAuthenticateUser,updateSupplier)
router.get('/getsupplieruser',isAuthenticateUser,getAllSupplier)
router.get('/supplieruser2/:id',isAuthenticateUser,getOneSupplier)
router.delete('/supplieruser3/:id',isAuthenticateUser,deleteSupplier)


module.exports = router