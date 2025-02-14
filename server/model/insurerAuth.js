const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const insurerSchema = new Schema({
    user_name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    phone_number:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },
    insurerFlag:{
        type:Boolean,
        default:true
    },
    empVehicleDetails: [{
        vehicle_type: { type: String, default: '' },
        vehicle_no: { type: String, default: '' },
        prev_insurance: { type: Boolean, default: false },
        expireDate:{type: String, default:""}
      }],
},{timestamps:true})

module.exports = mongoose.model("InsurerAuth",insurerSchema);