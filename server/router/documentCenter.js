const express = require('express')

const {createDocumentcenter,getAllDocuments, deleteDoc} = require("../controller/documentCenter");
const { isAuthenticateEmployer } = require('../controller/employer');
const { isAuthenticateAdmin } = require('../controller/admin');
const { isAuthenticateSupplier } = require('../controller/supplier');

const documentRoute = express.Router()

documentRoute.post('/createDoc/:tenantID',isAuthenticateEmployer, createDocumentcenter)
documentRoute.get('/getAlldoc/:tenantID',isAuthenticateEmployer,getAllDocuments)
documentRoute.get('/getAlldocadmin/:tenantID',isAuthenticateAdmin,getAllDocuments)
documentRoute.get('/getAlldocsupplier/:tenantID',isAuthenticateSupplier,getAllDocuments)

documentRoute.delete('/document/:tenantId/:docId', isAuthenticateEmployer, deleteDoc);


module.exports = documentRoute;