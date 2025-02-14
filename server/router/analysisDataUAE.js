const express = require('express');
const multer  = require('multer');
const { getAnalysisDataUAE,getAnalysisDataForUAEDashboard } = require('../controller/analysisDataUAE');
const analysisRouterUAE  = express.Router()



analysisRouterUAE.get('/allAnalysisUAE/:tenantID',getAnalysisDataUAE)
analysisRouterUAE.get('/dashboardAnalysisUAE/:tenantID',getAnalysisDataForUAEDashboard)



module.exports = analysisRouterUAE;
