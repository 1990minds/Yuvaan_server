const express = require('express');
const { generateQuotation, getQuotationsBySupplier, updateQuotation, getAllQuotations, fetchOneQuotation, getQuotationsByEmployer } = require('../controller/quotations');
const router = express.Router();

// Route for generating a new quotation
router.post('/quote', generateQuotation);

// Route for getting quotations by supplier ID
router.get('/quoteSupplier/:id', getQuotationsBySupplier);

// Route for getting quotations by employer ID
router.get('/quoteEmployer/:id', getQuotationsByEmployer);

// Route for updating an existing quotation by quotation ID
router.put('/quote/:quotationId', updateQuotation);

// Route for fetching all quotations
router.get('/quotations', getAllQuotations);

//Route for fetch one
router.get('/quote/single/:quotationId', fetchOneQuotation);

module.exports = router;
