const mongoose = require('mongoose')
const connectDB = require('../../config/db')
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema
const memebersDataSchema = new Schema ({
    EmployeeID:{
        type:String,
        trim :true,
    },
    Name:{
        type:String,
        trim :true,

    },
    DateOfBirth:{
        type:String,
        trim :true,

    },
    Gender:{
        type:String,
        trim :true,

    },
    Relationship:{
        type:String,
        trim :true,

    },
    EntityName:{
        type:String,
        trim :true,
        default:""

    },
    CurrentSumInsured:{
        type:String,
        trim :true,

    },
    NewOrProposedSumInsured:{
        type:String,
        trim :true,

    },
    Grade:{
        type:String,
        trim :true,
        default:""
    },
    AnyOtherImportantFlag:{
        type:String,
        trim :true,
        default:""
    },
    tenantId:{
        type: String,
        trim:true
    }

})
const memeberDataModel= mongoose.model('memberData', memebersDataSchema)

const getMemberDataDB = async(tenantId) =>{
    const dbName = `Tenant-${tenantId}`
    db = db ? db : await connectDB(url)
    let tenantDb = db.useDb(dbName, { useCache: true });
    return tenantDb;
  }
  const getMemberDataModel = async (tenantId) => {
    const tenantDb = await getMemberDataDB(tenantId);
    return tenantDb.model("memberData", memebersDataSchema)
  }

  module.exports=getMemberDataModel