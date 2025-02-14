const express = require('express')
const { movetoMarket, getMarketPlacePro, getMarketPlaceProAll, deleteFromMarket, getMarketPlaceProIndividual } = require('../controller/marketPlace')


const router = express.Router()
router.post('/marketPlace',movetoMarket)
router.get('/marketPlacepro/:id',getMarketPlacePro)
router.get('/marketPlaceproAll',getMarketPlaceProAll)
router.post('/marketPlaceproIndividual',getMarketPlaceProIndividual)
router.post('/marketPlaceDelete',deleteFromMarket)






module.exports = router