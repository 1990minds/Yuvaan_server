const express = require('express');
const router = express.Router();
const InsuranceRequest = require('../controller/InsuranceRequest');

// Route to create a new request
router.post('/createInsuranceRequest', InsuranceRequest.createRequest);

// Route to get a request by employeeId 
router.get('/getInsuranceRequestemp/:empId', InsuranceRequest.getRequestByEmployee);

// Route to get a request by supplierId
router.get('/getInsuranceRequestsup/:supid', InsuranceRequest.getRequestBysupID);

// Route to get a request
router.get('/getoneInsuranceRequest/:id', InsuranceRequest.getOneInsurRequest);

// Route to update a request by supplierId
router.put('/updateInsuranceRequest/:id', InsuranceRequest.updateRequestBySupplier);

module.exports = router;
