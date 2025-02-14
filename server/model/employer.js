const mongoose = require('mongoose')
const connectDB = require('../../config/db')


const Schema = mongoose.Schema
const employerSchema = new Schema({

    tenant_id: {
        type: String,

    },
    supplier: {
        type: Schema.Types.ObjectId,
        ref: "supplier"
    },
    employer_name: {
        type: String,
        trim: true

    },
    employer_image: {
        type: String,
        trim: true
    },
    employer_id: {
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
    alternate_phone: {
        type: String,
        trim: true
    },

    password: {
        type: String
    },

    firstTimeLogin: {
        type: Boolean,
        default: true,
    },
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
        },
        no_of_employee: {
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
        country_name: {
            type: String,
            trim: true,
            default: ""
        },
        city: {
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
        office_phone_no: {
            type: String,
            trim: true,
            default: ""
        },
        other_office_located: {
            type: String,
            trim: true,
            default: ""
        },
        country_currency: {
            type: String,
            trim: true,
            default: ""
        }

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
        eadress1: {
            type: String,
            trim: true,
            default: ""
        },
        eadress2: {
            type: String,
            trim: true,
            default: ""
        },

        ecity: {
            type: String,
            trim: true,
            default: ""
        },
        estate: {
            type: String,
            trim: true,
            default: ""
        },
        epincode: {
            type: String,
            trim: true,
            default: ""
        },

    },

    company_broucher: {
        type: String,
        trim: true,
        default: ""
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },







}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' })

const employerModel = mongoose.model('employer', employerSchema)



const getEmployerModel = async () => {
    try {
        const totalConnectDb = await connectDB(); // await the promise


        if (!totalConnectDb) {
            throw new Error("MongoDB connection not established");
        }

        return totalConnectDb.model("employer", employerSchema);
    } catch (error) {

        throw error;
    }
}

module.exports = getEmployerModel;