const mongoose = require('mongoose')

const Schema = mongoose.Schema
const supplierSchema = new Schema({

    admin_role: {
        type: String,
        trim: true

    },
    supplier_name: {
        type: String,
        trim: true

    },
    supplier_image: {
        type: String
    },
    supplier_id: {
        type: String

    },
    brand_name: {
        type: String,
        trim: true
    },
    point_of_contact: {
        type: String
    },
    designation: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    // user_name:{
    //     type:String,
    //     trim:true
    // },

    password: {
        type: String
    },

    firstTimeLogin: {
        type: Boolean,
        default: true,
    },
    // designation:{
    //     type:String
    // },
    company_details: {
        company_website_url: {
            type: String,
            default: ""
        },
        company_type: {
            type: String,
            trim: true,
            default: ""
        },
        industry_type: {
            type: String,
            trim: true,
            default: ""
        },
        license_number: {
            type: String,
            trim: true,
            default: ""
        },
        relevant_links: {
            type: String,
            trim: true,
            default: ""
        }

    },

    company_adress: {
        adress1: {
            type: String,
            trim: true,
            default: ""
        },
        adress2: {
            type: String,
            trim: true,
            default: ""
        },
        adress2: {
            type: String,
            trim: true,
            default: ""
        },
        city: {
            type: String,
            trim: true,
            default: ""
        },
        country_name: {
            type: String,
            trim: true,
            default: ""
        },
        state: {
            type: String,
            trim: true,
            default: ""
        },
        pincode: {
            type: String,
            trim: true,
            default: ""
        },

    },
    bank_account_details: {
        bank_name: {
            type: String,
            trim: true,
            default: ""
        },
        acc_no: {
            type: String,
            trim: true,
            default: ""
        },
        acc_type: {
            type: String,
            trim: true,
            default: ""
        },
        ifsc_code: {
            type: String,
            trim: true,
            default: ""
        }


    },
    builling_address: {
        badress1: {
            type: String,
            trim: true,
            default: ""
        },
        badress2: {
            type: String,
            trim: true,
            default: ""
        },
        badress2: {
            type: String,
            trim: true,
            default: ""
        },
        bcity: {
            type: String,
            trim: true,
            default: ""
        },
        bcountry_name: {
            type: String,
            trim: true,
            default: ""
        },
        bstate: {
            type: String,
            trim: true,
            default: ""
        },
        bpincode: {
            type: String,
            trim: true,
            default: ""
        },

    },
    company_brochure: {
        type: String,
        trim: true,
        default: ""
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "product"
    }],
    category_Subcategory: [
        {
            type: Schema.Types.ObjectId,
            ref: 'categories'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },



}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' })


module.exports = mongoose.model('supplier', supplierSchema)