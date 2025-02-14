const mongoose = require("mongoose");
const connectDB = require("../../config/db");

// MongoDB connection URL
const url ="mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

// Defining the schema for employee data
const Schema = mongoose.Schema;
const empBudSchema = new Schema(
  {
  
    type: {
      type: String,
      default: "",
    },
   
    name: {
      type: String,
      trim: true,
      default: "",
    },
    value: {
      type: String,
      trim: true,
      default: "",
    },
    

    
    username: {
      type: String,
      trim: true,
      default: "",
    },
    tenant_id: {
      type: String,
      default: "",
    }
    
  },
  { timestamps: true }
);

// Creating the Employee model
const empBudModel = mongoose.model("employeeBudget", empBudSchema);

// Function to get the employee model for a specific tenant
const getEmployeeDBbulk = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  // Reusing existing connection if available
  db = db ? db : await connectDB(url);
  // Using the specific database for the given tenant
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};

// Function to get the employee model for a specific tenant
const getEmployeeModelBulk = async (tenantId) => {
  const tenantDb = await getEmployeeDBbulk(tenantId);
  return tenantDb.model("employeeBudget", empBudSchema);
};

module.exports = getEmployeeModelBulk;
