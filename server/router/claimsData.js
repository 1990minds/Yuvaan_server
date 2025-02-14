const express = require('express');
const multer  = require('multer')
const path = require('path')
const { uploadCliamData, calculateClaimsData,getClaimsDataAnalysis, getClaimsDataCopayAnalysis, getClaimsDataCategorySumAnalysis, 
  getProviderClaimAnalysis, 
  getMembersDataAnalysis,
  getRFQAnalysis,
  getSomeInfo,
  getEmployee
} = require('../controller/claimsData');
const { getPriority } = require('os');



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

const claimRouter  = express.Router()

claimRouter.post('/claimDataUpload/:tenantID',upload.single('file'),uploadCliamData)
// claimRouter.get('/allClaims/:tenantID',// getEmployee
// )
module.exports = claimRouter;