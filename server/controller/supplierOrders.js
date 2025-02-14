// const getEmployerModel = require("../model/employer");
// const getEmployerOrderModel = require("../model/employerOrders");
// const Supplier = require("../model/supplier");
// const { customAlphabet } = require("nanoid");
// const SupplierOrder = require("../model/supplierOrders");
// const supplier = require("../model/supplier");
// const nanoid = customAlphabet("ABCDEFGHGHIJKLMNOPQRSTUVWXYZ1234567890", 6);
// const Notification = require('../model/notification');


// exports.createsupOrder = async (req, res) => {
//   console.log("my request ",req.body) 
//   try {
  
//     const Employer = await getEmployerModel();
//     const employer = await Employer.findById(req.body.employer);
//     const EmployerOrder = await getEmployerOrderModel(employer?.tenant_id);
//     const Order = await new EmployerOrder();
//     Order.employer = employer;
  

//     for (const productData of req.body.products) {
//       const supplier = await Supplier.findById(productData.supplier);
   

//       let supplierOrder = await SupplierOrder.findOne({ supplier: supplier._id });
    
//         supplierOrder = new SupplierOrder();
//       supplierOrder.employer = employer._id;
//       supplierOrder.name = employer.employer_name;
//       supplierOrder.orderID = `ORDER_${nanoid()}`;
//       supplierOrder.total = req.body.total;
//       supplierOrder.products = productData;
//       supplierOrder.supplier=productData.supplier

//       supplierOrder.order_status = req?.body?.order_status;
//   // Create notification if quotation status is 'quotation created'
//   if (supplierOrder.order_status === 'Ordered') {
//     const notification = new Notification({
//         supplierOrder: supplierOrder?._id,
//         message: `A New Order from: ${employer?.employer_name}`,
//         messageby:"Employer 1st time deleverable"
//     });
//     await notification.save();
// }
       
//       await supplierOrder.save();

     
//      await Order.orders?.push(supplierOrder);
//     }

//     await Order.save();

//     return res.status(201).json({ msg: "Order(s) created successfully" });
//   } catch (error) {
//     console.log(error);
//     return res.status(401).json({ msg: "Something went wrong" });
//   }
// };

// exports.updateSupOrderById = async (req, res) => {
//   try {
//     const updatedOrder = await SupplierOrder.findByIdAndUpdate(
//       { _id: req.params.id },
//       req.body,
//       { new: true }
//     ).populate("employer");

//     if (!updatedOrder) {
//       return res.status(404).json({ msg: "Supplier order not found" });
//     }
   


//     if (
//       (req.body.supplier_files && req.body.order_status === "Delivered") 

//   ) {
//       SupplierOrder.supplier_files = {
//           ...SupplierOrder.supplier_files,
//           supfile_1: req.body.supplier_files.supfile_1 || SupplierOrder.supplier_files.supfile_1 || "adminFile 1",
//           supfil_1Name: req.body.supplier_files.supfil_1Name || SupplierOrder.supplier_files.supfil_1Name || "adminFile 1 name",
//       };
//   }

//   if (req.body.order_status === 'Delivered') {
//     const notification = new Notification({
//       supplierOrder: updatedOrder?._id,
//       message: `Your  order with order Id: ${updatedOrder?.orderID}  has been delivered`,
//       messageby:"Supplier 2st time deleverable"
//     });
//     await notification.save();
// }




//     const EmployerOrder = await getEmployerOrderModel(
//       updatedOrder.employer?.tenant_id
//     );


//     const employerOrder = await EmployerOrder.findOne({
//       "orders._id": updatedOrder._id,
//     });



//     if (!employerOrder) {
//       return res.status(404).json({ msg: "Employer order not found" });
//     }

//     const orderToUpdateIndex = employerOrder.orders.findIndex((order) =>
//       order._id.equals(updatedOrder._id)
//     );



//     if (orderToUpdateIndex !== -1) {
//       employerOrder.orders[orderToUpdateIndex] = updatedOrder;
//     } else {
//       return res
//         .status(404)
//         .json({ msg: "Supplier order not found in employer order" });
//     }

//     await employerOrder.save();


//     return res
//       .status(200)
//       .json({ msg: "Order updated successfully", updatedOrder });
//   } catch (error) {
   
//     return res.status(500).json({ msg: "Something went wrong" });
//   }
// };



// exports.getAllSupplierOrders = async (req, res) => {

//   const suppierID = req.params.id
 
//   try {
  
//     const supplierOrders = await SupplierOrder.find({ supplier: suppierID}).sort({createdAt: -1}).populate("employer")

//     return res.status(200).json({ msg: "Success", supplierOrders});
//   } catch (error) {
   
//     return res.status(500).json({ msg: "Something Went Wrong" });
//   }
// };



// exports.getAllSupplierOrdersAdmin = async (req, res) => {
//   try {  
//     const supplierOrders = await SupplierOrder.find().sort({createdAt: -1}).populate("employer")

//     return res.status(200).json({ msg: "Success", supplierOrders});
//   } catch (error) {
   
//     return res.status(500).json({ msg: "Something Went Wrong" });
//   }
// };



// exports.getOneorder = async (req, res) => {
//   try {


//     // Fetch the order from the database by ID
//     const orderOne = await SupplierOrder.findById( req.params.id).populate("employer").populate("supplier");

//     // Check if the order exists
//     if (!orderOne) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     // If the order exists, return it as a response
//     return res.status(200).json({ msg: "Order found", orderOne });
//   } catch (error) {
   
//     return res.status(500).json({ msg: "Something went wrong" });
//   }
// };



// exports.getEmployerorder = async (req, res) => {
//   try {

//     // Fetch the order from the database by ID
//     const orderOneemp = await SupplierOrder.find({employer:req.params.id}).sort({createdAt: -1})

//     // Check if the order exists
//     if (!orderOneemp) {
//       return res.status(404).json({ msg: "Order not found" });
//     }

//     // If the order exists, return it as a response
//     return res.status(200).json({ msg: "Order found", orderOneemp });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Something went wrong" });
//   }
// };







const SupplierOrder = require("../model/supplierOrders");
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("ABCDEFGHGHIJKLMNOPQRSTUVWXYZ1234567890", 6);

// Create a new Supplier Order
exports.createSupplierOrder = async (req, res) => {
    try {
        const {   products, total, name, order_status, employer,employeeCount } = req.body;

        const newOrder = new SupplierOrder({
            orderID:`ORDER_${nanoid()}`,
            products,
            total,
            name,
            order_status,
            employer,
            employeeCount
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Thank you! Your purchase was successful!", data: newOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Get all Supplier Orders
exports.getAllSupplierOrders = async (req, res) => {
    try {
        const orders = await SupplierOrder.find().populate("employer products");
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};


// Get a single Employer Orders by ID
exports.getEmployerOrderById = async (req, res) => {
  try {
      const order = await SupplierOrder.find({employer:req.params.id}).populate("employer products");

      if (!order) {
          return res.status(404).json({ success: false, message: "Order not found" });
      }

      res.status(200).json({ success: true, data: order });
  } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get a single Supplier Order by ID
exports.getSupplierOrderById = async (req, res) => {
    try {
        const order = await SupplierOrder.findById(req.params.id).populate("employer products");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Update a Supplier Order
exports.updateSupplierOrder = async (req, res) => {
    try {
        const updatedOrder = await SupplierOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order updated successfully", data: updatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// Delete a Supplier Order
exports.deleteSupplierOrder = async (req, res) => {
    try {
        const deletedOrder = await SupplierOrder.findByIdAndDelete(req.params.id);

        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
