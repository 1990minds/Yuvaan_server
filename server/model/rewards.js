const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const connectDB = require("../../config/db");

// MongoDB connection URL
const url ="mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const rewardShema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "product"
  },
  rating: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
  },
  feedback:{
    type: String,
  },

}, { timestamps: true, createdAt: 'createdAt', updatedAt: 'updatedAt' });

const rewardsModel  = mongoose.model('rewards',rewardShema)

// Function to get the employee model for a specific tenant
const getRewardsDB = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  // Reusing existing connection if available
  db = db ? db : await connectDB(url);
  // Using the specific database for the given tenant
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};


// Function to get the employee model for a specific tenant
const getRewardsModel = async (tenantId) => {
  const tenantDb = await getRewardsDB(tenantId);
  return tenantDb.model("rewards", rewardShema);
};

module.exports = getRewardsModel;