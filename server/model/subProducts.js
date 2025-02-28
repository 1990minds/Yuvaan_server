const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subProductSchema = new Schema({
    vendors: {
        type: Schema.Types.ObjectId,
        ref: 'supplier',
    },
    session_type: {
        type: String,
    },
    product_type: {
        type: String,
        required: true
    },
    sub_pro_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    pricing: {
        costPerService: {
            type: Number
        },
        deductibleAmount: {
            type: Number, default: 0
        }
    },
    inclusions: [{ type: String }],
    serviceType: {
        type: String,
    },
    eligibility: {
        type: String,
    },
    sub_pro_image: {
        type: String,
    },
    status: {
        type: String,
    },
    displayOrder: {
        type: Number, default: 0
    },
    walletIntegration: {
        deductionAmount: { type: Number, default: 0 },
        balanceCheckThreshold: { type: Number, default: 0 },
    },
    serviceLimits: {
        maxUsesPerYear: { type: Number, default: 0 },
        subLimits: { type: String, default: null },
    },
    serviceValidity: {
        startDate: { type: Date },
        endDate: { type: Date },
    },
    regionalMapping: [{ type: String }],
    termsAndConditions: { type: String },

}, { timestamps: true });

module.exports = mongoose.model('subProducts', subProductSchema);

