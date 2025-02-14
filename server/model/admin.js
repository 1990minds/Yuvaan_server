const mongoose = require('mongoose')
 const Schema = mongoose.Schema

 const adminSchema = new Schema({

    admin_name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true
    },
    phone_no:{
        type:String,
        trim:true
    },
  
    password:{
        type:String,
        trim:true
    },

 },{timestamps:true})

 module.exports = mongoose.model("Admin",adminSchema)