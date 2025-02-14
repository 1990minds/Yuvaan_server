const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_name:{
        type:String,
        trim:true
    },
    phone_no:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    designation:{
        type:String,
        trim:true
    },
    password:{
        type:String,
        trim:true
    },
}, {timestamps:true})
module.exports = mongoose.model("User", userSchema)