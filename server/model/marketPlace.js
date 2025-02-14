const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const url =
  "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema;
const marketplaceSchema = new Schema(
  {
    product: {
      type:Schema.Types.ObjectId,
      ref:"product",
      default:null
    },
    
    employer:{
        type:Schema.Types.ObjectId,
        ref:"employer",
        default: null
        
    },

  },
  { timestamps: true }
);

const marketModel = mongoose.model("marketplace", marketplaceSchema);

const getMarketdDB = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  db = db ? db : await connectDB(url);
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};

const getMarketPlaceModel = async (tenantId) => {
  const tenantDb = await getMarketdDB(tenantId);
  return tenantDb.model("marketplace", marketplaceSchema);
};
module.exports = getMarketPlaceModel;
