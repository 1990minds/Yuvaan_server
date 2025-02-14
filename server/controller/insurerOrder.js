const Razorpay = require('razorpay');
const request = require('request');
const keys = require('../../server/key');
const { customAlphabet } = require('nanoid');
const InsurerOrder = require('../model/insurerOrder');
const moment = require('moment');
const axios = require('axios');

// Generate a unique order ID
const nanoid = customAlphabet('1234567890', 6);
const generatePolicyId = () => {
  const nanoid = customAlphabet('1234567890', 6);
  return `Tconn${nanoid()}`;
};
const policyId = generatePolicyId();

// Initialize Razorpay instance
const razorInstance = new Razorpay({
  key_id: keys.razorIdkey,
  key_secret: keys.razorIdSecret,
});

// Create an order (Razorpay only)
exports.ProductOrder = async (req, res) => {
  console.log("Request Body is", req.body);

  try {
    const options = {
      amount: req.body.total * 100,
      currency: "INR",
      receipt: nanoid(),
      payment_capture: 1,
    };

    razorInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error({ RazorpayError: err });
        return res.status(401).json({ message: "Something went wrong while creating the order" });
      }

      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    });
  } catch (err) {
    console.error({ Error: err });
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Capture payment and save order
exports.ProductPay = async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    // Step 1: Check payment status from Razorpay
    request(
      {
        method: "GET",
        url: `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${paymentId}`,
      },
      async (err, response, body) => {
        if (err) {
          console.error({ PaymentFetchError: err });
          return res.status(500).json({ message: "Error fetching payment status", error: err.message });
        }

        const paymentDetails = JSON.parse(body);

        // Calculate policyEndDate
        const purchaseDate = new Date( Date.now());
        const policyTerm = parseInt(req.body.policyTerm, 10); 
        const policyEndDate = new Date(purchaseDate);
        policyEndDate.setFullYear(policyEndDate.getFullYear() + policyTerm);

        if (paymentDetails.status === "captured") {
          // Payment is already captured
          const existingOrder = await InsurerOrder.findOne({ orderId: paymentDetails.order_id });
          if (existingOrder) {
            return res.status(200).json({
              message: "Order already exists for this payment",
              savedOrder: existingOrder,
            });
          }

          const newOrder = new InsurerOrder({
            orderId: paymentDetails.order_id,
            proID: req.body.proID,
            total: req.body.total,
            customer_name: req.body.customer_name,
            customer_phone: req.body.customer_phone,
            customer_email: req.body.customer_email,
            orderStatus: "Purchased",
            insurerId: req.body.insurerId,
            policyId,
            purchaseDate,
            policyEndDate,
          });

          await newOrder.save();

          return res.status(201).json({
            message: "Payment already captured and order saved successfully",
            paymentResponse: paymentDetails,
            savedOrder: newOrder,
          });
        } else if (paymentDetails.status === "authorized") {
          // Capture payment
          const amount = req.body.total * 100; // Amount in paisa

          request(
            {
              method: "POST",
              url: `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${paymentId}/capture`,
              form: {
                amount,
                currency: "INR",
              },
            },
            async function (err, response, body) {
              if (err) {
                console.error({ PaymentCaptureError: err });
                return res.status(401).json({ message: "Error capturing payment", error: err });
              }

              const paymentResponse = JSON.parse(body);

              const newOrder = new InsurerOrder({
                orderId: paymentResponse.order_id,
                proID: req.body.proID,
                total: req.body.total,
                customer_name: req.body.customer_name,
                customer_phone: req.body.customer_phone,
                customer_email: req.body.customer_email,
                orderStatus: "Purchased",
                insurerId: req.body.insurerId,
                policyId,
                purchaseDate,
                policyEndDate,
              });

              await newOrder.save();

              return res.status(201).json({
                message: "Payment captured and order saved successfully",
                paymentResponse,
                savedOrder: newOrder,
              });
            }
          );
        } else {
          return res.status(400).json({ message: "Payment is not in a capturable state", paymentDetails });
        }
      }
    );
  } catch (err) {
    console.error({ Error: err });
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};




//existing policy renewal request
exports.RenewPolicy = async (req, res) => {
  const { currentOrderId, policyAmount } = req.body.policyRenewData;
  console.log("my current id is " + currentOrderId)

  console.log("and the psyment amount for renewwell is " + policyAmount)
  try {
    // Step 1: Fetch the existing policy
    const existingPolicy = await InsurerOrder.findById(currentOrderId);
    if (!existingPolicy) {
      return res.status(404).json({ message: "Policy not found" });
    }



    // Step 3: Create a Razorpay order for renewal payment
    const options = {
      amount: policyAmount * 100,
      currency: "INR",
      receipt: `renew-${currentOrderId}`,
      payment_capture: 1,
    };

    razorInstance.orders.create(options, (err, order) => {
      if (err) {
        console.error({ RazorpayError: err });
        return res.status(500).json({ message: "Error creating Razorpay order", error: err.message });
      }

      return res.status(201).json({
        message: "Renewal Razorpay order created successfully",
        razorpayOrder: order,
      });
    });
  } catch (err) {
    console.error({ Error: err });
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Capture payment and update policy
exports.CaptureRenewalPayment = async (req, res) => {
  const { paymentId, currentOrderId, policyAmount, policyEndDate } = req.body;

  try {
    // Step 1: Verify the payment status
    const response = await axios.get(
      `https://${keys.razorIdkey}:${keys.razorIdSecret}@api.razorpay.com/v1/payments/${paymentId}`
    );
    const paymentDetails = response.data;

    if (paymentDetails.status === "captured") {
      // Step 2: Retrieve the existing policy
      const existingPolicy = await InsurerOrder.findById(currentOrderId);
      if (!existingPolicy) {
        return res.status(404).json({ message: "Policy not found" });
      }

      console.log("policy end date is ",policyEndDate)

      const currentDate = new Date();
      const endDate = new Date(policyEndDate);

      console.log("and the end date is",endDate)
      // Determine new start date
      const newStartDate = currentDate > endDate ? currentDate : endDate;
      const newEndDate = new Date(newStartDate);
      newEndDate.setFullYear(newEndDate.getFullYear() + 1); 
      // Update the policy details
      existingPolicy.total = policyAmount;
      existingPolicy.purchaseDate = newStartDate;
      existingPolicy.policyEndDate = newEndDate;

      try {
        await existingPolicy.save();
        return res.status(200).json({
          message: "Payment captured and policy renewed successfully",
          renewedPolicy: existingPolicy,
        });
      } catch (saveError) {
        console.error("Error saving updated policy:", saveError);
        return res.status(500).json({
          message: "Failed to save updated policy",
          error: saveError.message,
        });
      }
    } else {
      // If payment is not captured
      return res.status(400).json({ message: "Payment not captured", paymentDetails });
    }
  } catch (err) {
    console.error({ Error: err });
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};




exports.getOneInsurerOrder = async (req, res) => {
  try {
    const insurerOrder = await InsurerOrder.findOne({ _id: req.params.id }).populate("proID").exec();
    res.status(201).json({ msg: "successfully get one Insurer Order", insurerOrder })
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "Internal Server Error", err })
  }
}

exports.getAllInsurerOrder = async (req, res) => {
  try {
    const insurerOrders = await InsurerOrder.find({ insurerId: req.params.id }).populate("proID").exec();
    if (!insurerOrders || insurerOrders.length === 0) {
      return res.status(404).json({ msg: "No orders found for this insurer" });
    }
    res.status(200).json({ msg: "Successful", insurerOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
};

exports.getAllInsurerOrdersforSup = async (req, res) => {
  try {
    const insurerOrders = await InsurerOrder.find().populate("proID").exec();
    if (!insurerOrders || insurerOrders.length === 0) {
      return res.status(404).json({ msg: "No orders found for this insurer" });
    }
    res.status(200).json({ msg: "Successful", insurerOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal Server Error", err });
  }
}




