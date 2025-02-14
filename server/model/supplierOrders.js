
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierOrderSchema = new Schema({
    // supplier: {
    //     type: Schema.Types.ObjectId,
    //     ref: "supplier"
    // },
    orderID: {
        type: String,
        trim: true
    },
    products: {
        type: Schema.Types.ObjectId,
        ref:"specialProducts"
    },
    total: {
        type: Number,
        default: 0
    },
    name: {
        type: String,
        trim: true
    },
    order_status: {
        type: String,
        trim: true
    },
    employer: {
        type: Schema.Types.ObjectId,
        ref: "employer"
    },
    employeeCount: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

}, { timestamps: true });

module.exports = mongoose.model('SupplierOrder', supplierOrderSchema);