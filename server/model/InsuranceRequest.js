const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InsuranceRequestSchema = new Schema({
    insuranceID: {
        type: String,
        required: true
    },
    employeeDetails: {
        age: {
            type: Number,
            default: 0
        },
        gender: {
            type: String,
            default: "N/A"
        },
        name: {
            type: String,
            default: "N/A"
        },
        phone: {
            type: String,
            default: "N/A"
        },
        policyNumber: {
            type: String,
            default: "N/A"
        },
        annualLimit: {
            type: String,
            default: "N/A"
        },
        settled_FinalAmount: {
            type: String,
            default: "N/A"
        },
        employerName: {
            type: String,
            default: "N/A"
        }
    },
    selectedMember: {
        type: String,
        required: true
    },
    treatmentDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    uploadedFiles: [{
        name: {
            type: String,
           
        },
        link: {
            type: String,
           
        },
    }],
    employerId: {
        type: String,

    },
    supplierId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'supplier'
    },
    claimStatus: {
        statusValues: {
            type: String,
            default: "Claim Initiated"
        },
        comments: {
            type: String,
            default: ""
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('InsuranceRequest', InsuranceRequestSchema);
