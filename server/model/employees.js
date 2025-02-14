const mongoose = require("mongoose");
const connectDB = require("../../config/db");

// MongoDB connection URL
const url ="mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

// Defining the schema for employee data
const Schema = mongoose.Schema;
const employeeSchema = new Schema(
  {
  
    employeeCode: {
      type: String,
      default: "",
    },
   
    employeeName: {
      type: String,
      trim: true,
      default: "",
    },
    gender: {
      type: String,
      trim: true,
      default: "",
    },
    dateofBirth: {
      type: String,
      default: "",
    },
    dateofJoining: {
      type: String,
      trim: true,
      default: "",
    },
    position: {
      type: String,
      trim: true,
      default: "",
    },
    lastPromotedon: {
      type: String,
      trim: true,
      default: "",
    },
    currentSalary: {
      type: String,
      default: "",
    },
    currentManager: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    officeLocation: {
      type: String,
      default: "",
    },
    employeeResidence: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      trim: true,
      default: "",
    },
    tenant_id: {
      type: String,
      default: "",
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
    rewardsIncrease: {
      type: Boolean,
      default: false,
    },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    marketplace: [{
      type: Schema.Types.ObjectId,
      ref: "marketplace"
    }],
    empSkills: {
      type: [String], 
      default: [],
    },
    employer:{
      type:Schema.Types.ObjectId,
      ref:"employer"
    }
    
  },
  { timestamps: true }
);

// Creating the Employee model
const employeeModel = mongoose.model("employee", employeeSchema);

// Function to get the employee model for a specific tenant
const getEmployeeDB = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  // Reusing existing connection if available
  db = db ? db : await connectDB(url);
  // Using the specific database for the given tenant
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};

// Function to get the employee model for a specific tenant
const getEmployeeModel = async (tenantId) => {
  const tenantDb = await getEmployeeDB(tenantId);
  return tenantDb.model("employee", employeeSchema);
};

module.exports = getEmployeeModel;
