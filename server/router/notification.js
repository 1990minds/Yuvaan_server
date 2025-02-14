const express = require('express');
const router = express.Router();
const {getAllNotifications,getOneNotification,markNotificationAsRead} = require("../controller/notification")


router.get('/notifications',getAllNotifications)
router.get('/notification/:id',getOneNotification)
router.put('/notification/:id',markNotificationAsRead)

module.exports = router;
