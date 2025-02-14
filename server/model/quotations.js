const mongoose = require("mongoose");

const schema = mongoose.Schema;

const quotationSchema = new schema(
  {
    quotation_id: {
      type: String,
      trim: true,
    },
    product: {
      type: schema.Types.ObjectId,
      ref: "product",
    },
    product_name: {
      type: String,
      trim: true,
    },
    names: {
      type: String,
      trim: true,
    },
    additional: {
      type: String,
      trim: true,
    },
    prices: {
      type: String,
      trim: true,
    },
    quantities: {
      type: String,
      trim: true,
    },
    supplier: {
      type: schema.Types.ObjectId,
      ref: "supplier",
    },
    employer: {
      type: schema.Types.ObjectId,
      ref: "employer",
    },
    supplier_files: {
      supfile_1: String,
      supfil_1Name: String,    
    },

    admin_files: {
      admin_1: String,
      admin_1Name: String,  
      admin_2: String,
      admin_2Name: String,  
      approve_text:String
    },
    // employer_files: {
    //   file_1: String,
    //   fil_1Name: String,

    //   file_2: String,
    //   fil_2Name: String,

    //   file_3: String,
    //   fil_3Name: String,
    // },
    employer_files: [],
    quotation_status: {
      type: String,
     trim:true,
    },
    reject_reason: {
      type: String,
     trim:true,
    },
   
  },
  { timestamps: true }
);



module.exports = mongoose.model("quotation", quotationSchema);
