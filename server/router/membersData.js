const express = require('express')
const multer  = require('multer')
const path = require('path')
const { uploadMemberData, getMembersData } = require('../controller/membersData')

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

const memberRouter  = express.Router()

memberRouter.post('/memberDataUpload/:tenantID',upload.single('file'),uploadMemberData)
memberRouter.get('/getMembers/:tenantID',getMembersData)
module.exports = memberRouter;