const mongoose = require("mongoose");
const connectDB = require("../../config/db");
const url ="mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema;
const documentSchema = new Schema(
  {
    file_name: {
      type: String,
    },
    file_size: {
      type: String,
    },
    file_type: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    doc_file: {
      type: String,
    },
    tenant_id:{
      type: String,

    }
  },
  { timestamps: true, createdAt: "createdAt", updatedAt: "updatedAt" }
);

const documentModel = mongoose.model("document", documentSchema);


const getDocumentDB = async (tenantId) => {
  const dbName = `Tenant-${tenantId}`;
  // Reusing existing connection if available
  db = db ? db : await connectDB(url);
  // Using the specific database for the given tenant
  let tenantDb = db.useDb(dbName, { useCache: true });
  return tenantDb;
};


const getDocumentModel = async (tenantId) => {
  const tenantDb = await getDocumentDB(tenantId);
  return tenantDb.model("document", documentSchema);
};

module.exports = getDocumentModel