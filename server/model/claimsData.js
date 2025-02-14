const mongoose = require('mongoose')
const connectDB = require('../../config/db')
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema
const claimDataSchema = new Schema ({
    PolicyNumber: {
        type: String,
        trim: true,
        default:""
      },
      PolicyholderName: {
        type: String,
        trim: true,
        default:""
      },
      PolicyStartDate:  {
        type: String,
        trim: true,
        default:""
      },
      PolicyEndDate:  {
        type: String,
        trim: true,
        default:""
      },
      EmployeeID: {
        type: String,
        trim: true,
        default:""
      },
      EmployeeName: {
        type: String,
        trim: true,
        default:""
      },
      BeneficiaryID: {
        type: String,
        trim: true,
        default:""
      },
      BeneficiaryName: {
        type: String,
        trim: true,
        default:""
      },
      Relationship: {
        type: String,
        trim: true,
        default:""
      },
      BaseSumInsured:  {
        type: String,
        trim: true,
        default:""
      },
      TopUpSumInsured: {
        type: String,
        trim: true,
        default:""
      },
      TotalSumInsured:  {
        type: String,
        trim: true,
        default:""
      },
      BeneficiaryGender: {
        type: String,
        trim: true,
        default:""
      },
      BeneficiaryDateOfBirth:  {
        type: String,
        trim: true,
        default:""
      },
      ClaimNumber: {
        type: String,
        trim: true,
        default:""
      },
      TreatmentAdmissionDate:  {
        type: String,
        trim: true,
        default:""
      },
      DischargeDate: {
        type: String,
        trim: true,
        default:""
      },
      SettledDate:  {
        type: String,
        trim: true,
        default:""
      },
      ClaimStatus: {
        type: String,
        trim: true,
        default:""
      },
      ClaimedAmount:  {
        type: String,
        trim: true,
        default:""
      },
      SettledSanctionedAmount: {
        type: String,
        trim: true,
        default:""
      },
      Outstanding:  {
        type: String,
        trim: true,
        default:""
      },
      IncurredAmount:  {
        type: String,
        trim: true,
        default:""
      },
      ICDCode: {
        type: String,
        trim: true,
        default:""
      },
      DiseaseCategory: {
        type: String,
        trim: true,
        default:""
      },
      CoPay:  {
        type: String,
        trim: true,
        default:""
      },
      RoomRent:  {
        type: String,
        trim: true,
        default:""
      },
      Maternity:  {
        type: String,
        trim: true,
        default:""
      },
      BufferUtilization:{
        type: String,
        trim: true,
        default:""
      },
      CriticalIllness:{
        type: String,
        trim: true,
        default:""
      },
      ServiceType: {
        type: String,
        trim: true,
        default:""
      },
      ClaimType: {
        type: String,
        trim: true,
        default:""
      },
      ProviderHospitalName: {
        type: String,
        trim: true,
        default:""
      },
      ProviderCity: {
        type: String,
        trim: true,
        default:""
      },
    tenantId:{
        type: String,
        trim:true
    }

})
const claimDataModel= mongoose.model('claimData', claimDataSchema)

const getClaimDataDB = async(tenantId) =>{
    const dbName = `Tenant-${tenantId}`
    db = db ? db : await connectDB(url)
    let tenantDb = db.useDb(dbName, { useCache: true });
    return tenantDb;
  }
  const getClaimDataModel = async (tenantId) => {
    const tenantDb = await getClaimDataDB(tenantId);
    return tenantDb.model("claimData", claimDataSchema)
  }

  module.exports=getClaimDataModel