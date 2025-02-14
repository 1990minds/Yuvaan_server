const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadedFileSchema = new Schema({
    name: { type: String, },
    link: { type: String, },
});



const preAuthReqschema = new Schema({
    preauthID: { type: String, required: true },
    employeeDetails: {
        gender: { type: String, default: "N/A" },
        name: { type: String, default: "N/A" },
        phone: { type: String, default: "N/A" },
        policyNumber: { type: String, default: "N/A" },
        annualLimit: { type: String, default: "N/A" },
        settled_FinalAmount: { type: String, default: "N/A" },
        employerName: { type: String, default: "N/A" },
    },
    selectedMember: { type: String, required: true },
    treatmentDate: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
    preauthType: { type: String, required: true},
    coverageType: { type: String, required: true },
    emgRequest: { type: String, required: true },
    prfComunication: { type: String, required: true },
    preExtcondition: { type: String, required: true },
    signatureFile: { type: String },
    uploadedFiles: [uploadedFileSchema],
    employerId: { type: String,  },
    supplierId: { type: Schema.Types.ObjectId, required: true, ref: 'supplier' },
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

module.exports = mongoose.model('preauthRequest', preAuthReqschema);
