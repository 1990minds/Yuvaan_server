const getEmployerModel  = require("../model/employer");
const getEmployerOrderModel = require('../model/employerOrders')
const Supplier = require('../model/supplier')
const { customAlphabet } = require("nanoid");
const SupplierOrder = require('../model/supplierOrders');
const nanoid = customAlphabet("ABCDEFGHGHIJKLMNOPQRSTUVWXYZ1234567890", 6);



exports.getEmployerOrders = async (req, res) => {

    try {
      const employerId = req.params.id;
      const Employer = await getEmployerModel();
    const employer = await Employer.findById(employerId);
   
     const orders = await getEmployerOrderModel(employer?.tenant_id)

     const ordersOfEmployer = await orders.find()
    
      return res.status(200).json({ msg: "employer Order(s) fetched successfully", ordersOfEmployer });
    } catch (error) {
     
      return res.status(500).json({ msg: "Something went wrong" });
    }
  };