const express = require('express')
const { getEmployerOrders } = require('../controller/employerOrders')



const router = express.Router()

router.get('/employerOrder/:id',getEmployerOrders)

module.exports = router