const express = require('express')
const router = express.Router()

const {createInsurer,getAllInsurer,getOneInsurer,login, updateInsurerVehicleDetails, updateEmployeeVehicleDetailsParicular, loginWithOtp} = require('../controller/insurerAuth')


router.post('/createInsurer', createInsurer)
router.get('/getAllInsurers', getAllInsurer)
router.get('/getOneInsurer/:id', getOneInsurer)
router.post('/loginInsurer', login)
router.post('/loginInsurerOtp', loginWithOtp)

router.put('/vehicleDetails/:id',updateInsurerVehicleDetails)
router.put('/:insurerID/vehicle/:vehicleID',updateEmployeeVehicleDetailsParicular)


module.exports = router