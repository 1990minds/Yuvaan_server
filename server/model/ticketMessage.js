// ticketMessage.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ticketMessageSchema = new Schema({
  sender: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  readByAdmin:{
    type:String,
    default:false
},
  readByEmployer:{
  type:String,
  default:false
},
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = ticketMessageSchema;
