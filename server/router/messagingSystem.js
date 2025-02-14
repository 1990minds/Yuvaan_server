const express = require('express')
const { getMessagesSupplier, getMessagesEmployer, getAllMessage, markmessageAsRead } = require('../controller/messagingSystem')

const messageRouter =  express.Router()

messageRouter.get('/messageSupplier/:supplierID',getMessagesSupplier)
messageRouter.get('/messageEmployer/:employerID',getMessagesEmployer)
messageRouter.get('/getAllmessages/:qtnID',getAllMessage)
messageRouter.put('/message/:id',markmessageAsRead)


module.exports = messageRouter