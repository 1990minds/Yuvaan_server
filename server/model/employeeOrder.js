const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeeOrderSchema = new Schema({
    orderID: {
        type: String,
        required: true
    },
    pro_name: {
        type: String,
        required: true
    },
    pro_img: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    pro_prize: {
        type: Number,
        required: true
    },
    proID: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Rewards', 'Razorpay', 'Rewards + Razorpay'],
        required: true
    },
    rewardsUsed: {
        type: Number,
        default: 0
    },
 
    orderDate: {
        type: Date,
        default: Date.now
    },
    deliveryDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', employeeOrderSchema);
