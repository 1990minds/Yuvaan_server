// routes/employerSettingsRoutes.js
const express = require('express');
const router = express.Router();
const employerSettingsController = require('../controller/employerRewardsRatio');

// Get reward settings for an employer
router.get('/employer-settings/:employerId', employerSettingsController.getEmployerSettings);

// Create or update reward settings for an employer
router.put('/:employerId/reward-ratio', employerSettingsController.saveOrUpdateEmployerSettings);

module.exports = router;
