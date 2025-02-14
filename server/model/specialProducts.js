const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const specialProductSchema = new Schema({
    product_name: {
        type: String,
        trim: true,
    },
    sub_products: [{
        type: Schema.Types.ObjectId,
        ref: "subProducts"
    }],
    category_name: {
        type: String,
        trim: true,
    },
    subCategory_name: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    product_image: {
        type: String,
    },
    target_audience: {
        type: [String],
    },
    tags: {
        type: [String],
    },
    status: {
        type: String,
        default: "Active",
    },
    display_order: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

module.exports = mongoose.model('specialProducts', specialProductSchema);
