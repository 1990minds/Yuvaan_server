const mongoose = require('mongoose');


const connectDB = require('../../config/db');
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;


const Schema = mongoose.Schema;

const rfqSchemaUAE = new Schema({
  tenant_id: {
    type: String,
    default: ""
  },
  policy_summary:{
    riskPeriod: {
        expiry: {
          startDate: { type: String, trim: true },
          endDate: { type: String, trim: true }
        },
        renewal: {
          startDate: { type: String, trim: true },
          endDate: { type: String, trim: true }
        }
      },
      claims: {
        asOnDate: { type: String, trim: true },
        // settled: { type: String, trim: true },
        // outstanding: { type: String, trim: true },
        // totalIncurred: { type: String, trim: true },
        // numberOfClaims: { type: String, trim: true }
      },
      premiums: {
        inception: { type: String, trim: true },
        endorsement: { type: String },
        finalAtClaimsDate: { type: String, trim: true }
      },

       total_Policy_Days: { type: String, trim: true },
            policy_Run_Days:{ type: String, trim: true },
            policy_Left_Days:{ type: String, trim: true }

  },
  
  members_summary:{
    employees: {
        inception: {
          employees: { type: String, trim: true },
          dependents: { type: String, trim: true },
          lives: { type: String, trim: true }
        },
        expiry: {
          employees: { type: String, trim: true },
          dependents: { type: String, trim: true },
          lives: { type: String, trim: true }
        },
        renewal: {
          employees: { type: String, trim: true },
          dependents: { type: String, trim: true },
          lives: { type: String, trim: true }
        }
      }
}
 
    
}, { timestamps: true });


const claimModel = mongoose.model('RFQUAE', rfqSchemaUAE);


const getRFQDBUAE = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  db = db ? db : await connectDB(url);
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};


const getRFQModelUAE = async (tenantId) => {
  const tenantDb = await getRFQDBUAE(tenantId);
  return tenantDb.model("RFQUAE", rfqSchemaUAE);
};

module.exports = getRFQModelUAE;