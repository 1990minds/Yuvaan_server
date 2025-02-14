const mongoose = require('mongoose')

const Schema = mongoose.Schema

const messagingSchema = new Schema({
    fromAdmin:{
        type:String,
        default:null
       
    },
    fromSupplier:{
        type:String,
        default:null,

        
    },
    fromEmployer:{
        type:String,
        default:null
        
    },
    recievedByAdmin:{
        type:String,
        default:false
    },
    recievedBySupplier:{
        type:String,
        default:false
    },
    recievedByEmployer:{
        type:String,
        default:false
    },
    readByAdmin:{
        type:String,
        default:false
    },
    readBySupplier:{
        type:String,
        default:false
    },
    readByEmployer:{
        type:String,
        default:false
    },
    messageContent:{
        type:String,
        trim:true
    },
    quotation:{
        type:Schema.Types.ObjectId,
        ref:"quotation"
        }
},{timestamps:true})



module.exports = mongoose.model("messaging",messagingSchema)