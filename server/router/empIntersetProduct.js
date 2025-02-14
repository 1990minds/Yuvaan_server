const express = require('express');
const router = express.Router();
const { createEmpIntPro, getAllEmpIntPro, getEmpIntProById, deleteEmpIntPro, getEmpIntProByEmpId, getEmpIntProByProductId, updateInterestProductStatus } = require('../controller/empIntersetProduct');

// Create a new interest
router.post('/empInterest', createEmpIntPro);

// Get all interests
router.get('/empInterest/:supId', getAllEmpIntPro);

// Get a single interest by ID
router.get('/empInterestIndividual/:id', getEmpIntProByEmpId);

// Get a single interest by ID of Product
router.get('/empInterestIndividualProduct/:id', getEmpIntProByProductId);


// Delete an interest by ID
// router.delete('/empInterest/:tenantId/:id', deleteEmpIntPro);

// Update an interest by ID
router.put('/empInterest/:id', updateInterestProductStatus);

module.exports = router;
