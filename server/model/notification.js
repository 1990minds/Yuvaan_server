const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  quotation: {
    type: Schema.Types.ObjectId,
    ref: "quotation",
  },
  supplierOrder: {
    type: Schema.Types.ObjectId,
    ref: "SupplierOrder",
  },
  message: {
    type: String,
    required: true,
  },
  messageby: {
    type: String,
    required: true,
  },
  readStatusbyemp: {
    type: Boolean,
    default: false,
  },
  readStatusbysup: {
    type: Boolean,
    default: false,
  }, readStatusbyadm: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Notification", notificationSchema);
