const express = require('express');
const { createTicket, getAllTickets, getOneTicket, deleteTicket, updateTicket, getAllTicketsForEmployer } = require('../controller/ticketManagement');
const ticketRouter  = express.Router()


ticketRouter.post('/ticketRise',createTicket)
ticketRouter.get('/allTickets',getAllTickets)
ticketRouter.get('/empTickets/:employerId',getAllTicketsForEmployer)

ticketRouter.get('/oneTicket/:id',getOneTicket)
ticketRouter.put('/updateTicket/:id',updateTicket)
ticketRouter.delete('/deleteTicket/:id',deleteTicket)

module.exports = ticketRouter;
