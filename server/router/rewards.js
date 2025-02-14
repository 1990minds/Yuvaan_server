const express = require('express');
const router = express.Router();
const rewardController = require('../controller/rewards');



// Create a new order
router.post('/createReward', rewardController.createReward);