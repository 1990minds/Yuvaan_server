const express = require('express')
const multer  = require('multer')
const path = require('path')
const { uploadMembersDataUAE, getMembersDataUAE } = require('../controller/membersDataUAE')

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

const memberRouterUSE  = express.Router()

memberRouterUSE.post('/memberDataUploadUAE/:tenantID',upload.single('file'),uploadMembersDataUAE)
memberRouterUSE.get('/getMembersUAE/:tenantID',getMembersDataUAE)
module.exports = memberRouterUSE;