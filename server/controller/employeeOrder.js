// controllers/orderController.js
const Order = require('../model/employeeOrder');
const { nanoid } = require('nanoid');
const Product = require('../model/product');
const Razorpay = require('razorpay');
const keys = require('../../server/key');
const request = require('request');
const  axios  = require('axios');


const orderID = `Tconn${nanoid(10)}`;

const razorInstance = new Razorpay({
    key_id: keys.razorIdkey,
    key_secret: keys.razorIdSecret,
  });

// Create a new order
exports.createOrder = async (req, res) => {
    console.log("Request Body: ", req.body);
    try {
        const { pro_name, pro_img, currency, pro_prize, proID, userID, rewardsPoints, total } = req.body;

        // Check if rewards points are sufficient to cover the entire amount
        if (rewardsPoints >= parseInt(pro_prize)) {
            // Create order directly using rewards points
            const orderData = {
                orderID: nanoid(),
                pro_name,
                pro_img,
                currency,
                pro_prize,
                proID,
                userID,
                paymentMethod: "Rewards", 
                totalAmount: total,
                rewardsUsed: total,
            };

            const order = await Order.create(orderData);
            await Product.findByIdAndUpdate(proID, { $inc: { purchaseCount: 1 } });

            return res.status(201).json({
                message: "Order created successfully using rewards points",
                order,
            });
        }

        // If rewards points are insufficient, proceed with Razorpay
        const amountToPay = total - rewardsPoints;

        if (amountToPay <= 0) {
            return res.status(400).json({ message: "Invalid payment amount" });
        }

        const options = {
            amount: amountToPay * 100, // Convert to paisa
            currency: "INR",
            receipt: nanoid(),
            payment_capture: 1,
        };

        razorInstance.orders.create(options, (err, order) => {
            if (err) {
                console.error({ RazorpayError: err });
                return res.status(500).json({ message: "Error creating Razorpay order", error: err });
            }

            return res.status(201).json({
                message: "Order created successfully. Please proceed with payment",
                razorOrder: order,
                amountToPay,
                rewardsUsed: rewardsPoints,
            });
        });
    } catch (error) {
        console.log("Error creating order", error);
        res.status(500).json({ message: error.message });
    }
};


// for capture and the save the order
exports.capturePayment = async (req, res) => {
    console.log("req body is ", req.body);
    try {
        const { paymentId, amount, orderData } = req.body;

        const captureUrl = `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${paymentId}/capture`;

        const captureResponse = await axios.post(captureUrl, {
            amount: amount * 100, 
            currency: 'INR'
        });

        if (captureResponse.data.status === 'captured') {
            // Save order in the database
            const orderDetails = {
                orderID: nanoid(),
                pro_name: orderData.pro_name,
                pro_img: orderData.pro_img,
                currency: orderData.currency,
                pro_prize: orderData.pro_prize,
                proID: orderData.proID,
                userID: orderData.userID,
                paymentMethod: "Razorpay",
                totalAmount: amount,
                rewardsUsed: 0, 
                razorpay_payment_id: paymentId,
            };

            const order = await Order.create(orderDetails);
            await Product.findByIdAndUpdate(orderData.proID, { $inc: { purchaseCount: 1 } });

            return res.status(200).json({
                success: true,
                message: 'Payment captured and order created successfully',
                order,
            });
        } else {
            return res.status(400).json({ success: false, message: 'Failed to capture payment' });
        }
    } catch (error) {
        console.error("Error capturing payment:", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


// Get all orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders by EmpID
exports.getOrdersByEmployeeId = async (req, res) => {
    const id = req.params.id;
    try {
        const orders = await Order.find({ userID: id })
            .populate('proID')
            .sort({ createdAt: -1 });

        // Check if orders are found
        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this employee' });
        }

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Get all orders by Supplier ID
exports.getOrdersBySupplierId = async (req, res) => {
    const supplierId = req.params.supplierId;

    try {
        // Fetch orders, but only populate the proID if the supplier matches.
        const orders = await Order.find()
            .populate({
                path: 'proID',
                match: { supplier: supplierId }  // Match only products related to the supplier
            })
            .sort({ createdAt: -1 })  // Sort by createdAt descending
            .exec();

        // Filter out orders where the populated `proID` is null (i.e., no matching supplier)
        const filteredOrders = orders.filter(order => order.proID);

        if (filteredOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found for this supplier' });
        }

        // Send back the filtered orders
        res.status(200).json(filteredOrders);
    } catch (error) {
        console.error("Error fetching supplier orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};




// Get one order by ID
exports.getOrderById = async (req, res) => {
    console.log("----",req.params.id)
    try {
        const order = await Order.findById(req.params.id).populate("proID")
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        console.log('first,err',error);
        res.status(500).json({ message: error.message });
    }
};

// Update an order by ID
exports.updateOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete an order by ID
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
