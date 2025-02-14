const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const insurerOrderSchema = new Schema({
    orderId: {
        type: String,
        trim: true
    },
    proID: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    insurerId: {
        type: Schema.Types.ObjectId,
        ref: 'InsurerAuth',
    },
    total: {
        type: Number,
        default: 0
    },
    customer_name: {
        type: String,
    },
    customer_phone: {
        type: String,

    },
    customer_email: {
        type: String,
    },
    orderStatus: {
        type: String,
        default: 'Purchased'
    },
    policyId: {
        type: String,
    },
    purchaseDate:{
        type:Date,
    },
    policyEndDate:{
        type:Date,
    }
}, { timestamps: true })
module.exports = mongoose.model('insurerOrder', insurerOrderSchema)

