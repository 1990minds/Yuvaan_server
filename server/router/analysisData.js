const express = require('express');
const multer  = require('multer');
const { getAnalysisData, getAnalysisDataForDashboard } = require('../controller/analysisData');
const analysisRouter  = express.Router()



analysisRouter.get('/allAnalysis/:tenantID',getAnalysisData)
analysisRouter.get('/dashboardAnalysis/:tenantID',getAnalysisDataForDashboard)



module.exports = analysisRouter;
