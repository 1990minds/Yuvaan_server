const express = require('express');
const router = express.Router();
const { createEmployeeOnboardYuvaan, getEmployeeOnboardYuvaan, getAllEmployeeOnboardYuvaan } = require('../controller/employerOnboardYuvaan');

// Route to create a new employee onboard form
router.post('/onboardingYuvaan', createEmployeeOnboardYuvaan);

// Route to get all employee onboard forms or a specific one by id
router.get('/onboardingYuvaan/:id', getEmployeeOnboardYuvaan);

router.get('/onboardingYuvaan', getAllEmployeeOnboardYuvaan);

module.exports = router;
