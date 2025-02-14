// const mongoose = require('mongoose')
// const connectDB = require('../../config/db')
// const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
// let db;

// const Schema = mongoose.Schema
// const claimDataSchemaUAE = new Schema ({
//   policyNumber: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       groupNamepolicyholderName: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       policyStartDate:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       policyEndDate:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       employeeMemberNo: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       employeeName: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       beneficiaryMemberNo: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       beneficiaryName: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       relationship: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       annualLimit:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       beneficiaryGender: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       beneficiaryDateOfBirth:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       beneficieryNationality: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       regulatory:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       networkclassification: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       category:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimNumber: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimSource:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       ip_op: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       treatmentAdmissionDate:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       dischargeDate: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimReceivedDate:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       settledDate:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimType: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimStatus: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       paymentSatus:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       claimedRequested:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       Copay_DeductibleAmount:  {
//         type: String,
//         trim: true,
//         default:""
//       },
//       rejectedAmount:{
//         type: String,
//         trim: true,
//         default:""
//       },
//       settled_FinalAmount:{
//         type: String,
//         trim: true,
//         default:""
//       },
//       primaryICDcode: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       primaryICDdescription: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       secondaryICDcode: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       secondaryICDdescription: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       servicetype: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       serviceCode: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       diagnosisType: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       providerGroup: {
//         type: String,
//         trim: true,
//         default:""
//       }, 
//       providerName: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       providerType: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       providerCity: {
//         type: String,
//         trim: true,
//         default:""
//       },
//       resubmissionFlag: {
//         type: String,
//         trim: true,
//         default:""
//       },
//     tenantId:{
//         type: String,
//         trim:true
//     }

// })
// const claimDataModel= mongoose.model('claimDataUAE', claimDataSchemaUAE)

// const getClaimDataDBUAE = async(tenantId) =>{
//     const dbName = `Tenant-${tenantId}`
//     db = db ? db : await connectDB(url)
//     let tenantDb = db.useDb(dbName, { useCache: true });
//     return tenantDb;
//   }
//   const getClaimDataModelUAE = async (tenantId) => {
//     const tenantDb = await getClaimDataDBUAE(tenantId);
//     return tenantDb.model("claimDataUAE", claimDataSchemaUAE)
//   }

//   module.exports=getClaimDataModelUAE


const mongoose = require('mongoose');
const connectDB = require('../../config/db'); // Your connection file
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net"; // Your connection string
let db;

// Define the schema for claims data
const Schema = mongoose.Schema;
const claimDataSchemaUAE = new Schema({
    policyNumber: { type: String, trim: true, default: "" },
    groupNamepolicyholderName: { type: String, trim: true, default: "" },
    policyStartDate: { type: String, trim: true, default: "" },
    policyEndDate: { type: String, trim: true, default: "" },
    employeeMemberNo: { type: String, trim: true, default: "" },
    employeeName: { type: String, trim: true, default: "" },
    beneficiaryMemberNo: { type: String, trim: true, default: "" },
    beneficiaryName: { type: String, trim: true, default: "" },
    relationship: { type: String, trim: true, default: "" },
    annualLimit: { type: String, trim: true, default: "" },
    beneficiaryGender: { type: String, trim: true, default: "" },
    beneficiaryDateOfBirth: { type: String, trim: true, default: "" },
    beneficieryNationality: { type: String, trim: true, default: "" },
    regulatory: { type: String, trim: true, default: "" },
    networkclassification: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    claimNumber: { type: String, trim: true, default: "" },
    claimSource: { type: String, trim: true, default: "" },
    ip_op: { type: String, trim: true, default: "" },
    treatmentAdmissionDate: { type: String, trim: true, default: "" },
    dischargeDate: { type: String, trim: true, default: "" },
    claimReceivedDate: { type: String, trim: true, default: "" },
    settledDate: { type: String, trim: true, default: "" },
    claimType: { type: String, trim: true, default: "" },
    claimStatus: { type: String, trim: true, default: "" },
    paymentSatus: { type: String, trim: true, default: "" },
    claimedRequested: { type: String, trim: true, default: "" },
    Copay_DeductibleAmount: { type: String, trim: true, default: "" },
    rejectedAmount: { type: String, trim: true, default: "" },
    settled_FinalAmount: { type: String, trim: true, default: "" },
    primaryICDcode: { type: String, trim: true, default: "" },
    primaryICDdescription: { type: String, trim: true, default: "" },
    secondaryICDcode: { type: String, trim: true, default: "" },
    secondaryICDdescription: { type: String, trim: true, default: "" },
    servicetype: { type: String, trim: true, default: "" },
    serviceCode: { type: String, trim: true, default: "" },
    diagnosisType: { type: String, trim: true, default: "" },
    providerGroup: { type: String, trim: true, default: "" },
    providerName: { type: String, trim: true, default: "" },
    providerType: { type: String, trim: true, default: "" },
    providerCity: { type: String, trim: true, default: "" },
    resubmissionFlag: { type: String, trim: true, default: "" },
    tenantId: { type: String, trim: true }
}, { timestamps: true });

const claimDataModel = mongoose.model('claimDataUAE', claimDataSchemaUAE);

// Function to get tenant-based DB
const getClaimDataDBUAE = async (tenantId) => {
    const dbName = `Tenant-${tenantId}`;
    db = db || await connectDB(url);  // Reuse connection
    return db.useDb(dbName, { useCache: true });
};

// Function to get model for a tenant
const getClaimDataModelUAE = async (tenantId) => {
    const tenantDb = await getClaimDataDBUAE(tenantId);
    return tenantDb.model("claimDataUAE", claimDataSchemaUAE);
};

module.exports = getClaimDataModelUAE;
