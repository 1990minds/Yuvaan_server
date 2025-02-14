
const express = require('express');
const multer  = require('multer')
const path = require('path');
const {uploadRFQExcel, getRFQData } = require('../controller/rfq');


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

const rfqRouter  = express.Router()

rfqRouter.post('/rfqUpload/:tenantID',upload.single('file'),uploadRFQExcel)

rfqRouter.get('/getrfqdata/:tenantID', getRFQData);



module.exports = rfqRouter;