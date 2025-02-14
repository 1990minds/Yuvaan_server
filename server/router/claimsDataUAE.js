// const express = require('express');
// const multer  = require('multer')
// const path = require('path')
// const { uploadCliamDataUAE, calculateClaimsData,getClaimsDataAnalysis, getClaimsDataCopayAnalysis, getClaimsDataCategorySumAnalysis, 
//   getProviderClaimAnalysis, 
//   getMembersDataAnalysis,
//   getRFQAnalysis,
//   getSomeInfo,
//   getEmployee
// } = require('../controller/claimsDataUAE');
// const { getPriority } = require('os');



// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       const uniqueSuffix = Date.now()

//       console.log(file.fieldname)
//       cb(null, file.fieldname + '-' +uniqueSuffix +path.extname(file.originalname) )
//     }
//   })
  
//   const upload = multer({ storage: storage })

// const claimRouterUAE  = express.Router()

// claimRouterUAE.post('/claimDataUploadUAE/:tenantID',upload.single('file'),uploadCliamDataUAE)
// // claimRouterUAE.get('/allClaims/:tenantID',
// // getEmployee
// // )
// module.exports = claimRouterUAE;



const express = require('express');
const router = express.Router();
const claimsDataController = require('../controller/claimsDataUAE');
const multer = require('multer');
const path = require('path');

// Multer setup for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter to validate Excel file types
const fileFilter = (req, file, cb) => {
  // Accept only Excel files (either .xls or .xlsx)
  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
    file.mimetype === 'application/vnd.ms-excel' // .xls
  ) {
    cb(null, true); // Accept file
  } else {
    cb(new Error('Invalid file type. Only Excel files are allowed.'), false); // Reject file
  }
};

const upload = multer({
    storage,
    fileFilter
});

// Route for uploading claim data
router.post('/claimDataUploadUAE/:tenantID', upload.single('file'), claimsDataController.uploadCliamDataUAE);

router.post('/getClaimsemployee',claimsDataController.getEmployeeClaimsData)

module.exports = router;
