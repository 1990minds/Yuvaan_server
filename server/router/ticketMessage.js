// routers/messageRouter.js

const express = require('express');
const { getMessages, sendMessage } = require('../controller/ticketMessage');

const router = express.Router();

router.get('/messages/:ticketId', getMessages);
router.post('/messages', sendMessage);

module.exports = router;
