const express = require('express')
const { updateSupplierOrder, createSupplierOrder, getAllSupplierOrders, getSupplierOrderById, deleteSupplierOrder, getEmployerOrderById } = require('../controller/supplierOrders')


const router = express.Router()
router.post('/empOrders',createSupplierOrder)
router.put('/empOrders/:id',updateSupplierOrder)
router.get('/empOrders',getAllSupplierOrders )
router.get('/empOrders/:id',getSupplierOrderById)
router.delete('/empOrders/:id',deleteSupplierOrder)
router.get('/getempOrders/:id',getEmployerOrderById)

module.exports = router