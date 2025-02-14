const express = require('express');
const router = express.Router();
const PreAuthRequest=require("../controller/preAuthReq");


//router to create a new preauth request
router.post('/craetepreAuthrequest',PreAuthRequest.createPreauthRequest);

// Route to get a request by employeeId 
router.get('/getPreauthrequestbyemp/:empId',PreAuthRequest.getRequestByEmployee);

// Route to get a request by supplierId
router.get('/getPreauthrequestbysupplier/:supid',PreAuthRequest.getRequestBysupID);

// Route to get a request
router.get('/getonepreauthrequest/:id',PreAuthRequest.getOnePreauthRequest);

// Route to update a request by supplierId
router.put('/updatePreauthrequest/:id',PreAuthRequest.updateRequestBysupplier);

module.exports = router;
