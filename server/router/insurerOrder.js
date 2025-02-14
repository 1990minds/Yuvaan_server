const express = require('express');      
const router = express.Router()
const {ProductOrder,ProductPay,getAllInsurerOrder,getOneInsurerOrder, getAllInsurerOrdersforSup, RenewPolicy, CaptureRenewalPayment} = require('../controller/insurerOrder')


router.post("/product-order", ProductOrder);

  
router.post("/capture-product/:paymentId", ProductPay )

router.get("/getOneInsurerOrder/:id", getOneInsurerOrder)

router.get("/getallInsurerOrders/:id", getAllInsurerOrder)

router.get("/getallInsurerOrderSup", getAllInsurerOrdersforSup)

router.post("/policies/renew",RenewPolicy)

router.post("/policies/renew-capture",CaptureRenewalPayment)
,


  module.exports = router;