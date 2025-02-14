const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wellServiceSchema = new Schema({
    serviceId: { type: String, trim: true },
    subProId: {
        type: Schema.Types.ObjectId,
        ref: "subProducts",
        required: true
    },
    employeeID: {
        type: Schema.Types.ObjectId,
        ref: "employeeUAE",
        required: true
    },
    supID: {
        type: Schema.Types.ObjectId,
        ref: "supplier",
        required: true
    },
    emprID: {
        type: Schema.Types.ObjectId,
        ref: "employer",
        required: true
    },
    serviceName: { type: String, trim: true },
    serviceCharge: { type: Number, trim: true },
    emplyee_name: { type: String },
    employee_email: { type: String },
    employee_phon: { type: Number },
    status: { type: String, default:"Booked"},
    serviceTo: { type: String},
    serviceDescribe: { type: String},



},{timestamps: true})
module.exports = mongoose.model('wellServices',wellServiceSchema);