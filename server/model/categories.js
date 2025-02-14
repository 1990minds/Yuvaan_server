const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({


    category_name: {
        type: String,

    },

    subCategory_name: {
        type: String
    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "supplier"
    },
}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' })


module.exports = mongoose.model('categories', categorySchema)