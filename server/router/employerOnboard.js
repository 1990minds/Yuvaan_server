const express = require('express');
const router = express.Router();
const { createEmployeeOnboard, getEmployeeOnboard, getAllEmployeeOnboard } = require('../controller/employerOnboard');

// Route to create a new employee onboard form
router.post('/onboarding', createEmployeeOnboard);

// Route to get all employee onboard forms or a specific one by id
router.get('/onboarding/:id', getEmployeeOnboard);

router.get('/onboarding', getAllEmployeeOnboard);

module.exports = router;
