const mongoose = require('mongoose')
const connectDB = require('../../config/db')
const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema
const memebersDataSchemaUAE = new Schema ({
    employeeId:{
        type:String,
        trim :true,
    },
    beneficiaryMemberNo:{
        type:String,
        trim :true,

    },
    beneficiaryName:{
        type:String,
        trim :true,

    },
    dateOfBirth:{
        type:String,
        trim :true,

    },
    gender:{
        type:String,
        trim :true,

    },
    relationship:{
        type:String,
        trim :true,
        default:""

    },
    group_clientName:{
        type:String,
        trim :true,

    },
    currentAnnualLimit:{
        type:String,
        trim :true,

    },
    newOrProposedSumInsured:{
        type:String,
        trim :true,
        default:""
    },
    networkClassification:{
        type:String,
        trim :true,
        default:""
    },
    category:{
        type:String,
        trim :true,
        default:""
    },
    memberNationality:{
        type:String,
        trim :true,
        default:""
    },
    memberEmirate:{
        type:String,
        trim :true,
        default:""
    },
    regulatoy:{
        type:String,
        trim :true,
        default:""
    },
    anyOtherImportantFlag:{
        type:String,
        trim :true,
        default:""
    },
    tenantId:{
        type: String,
        trim:true
    }

})
const memeberDataModel= mongoose.model('memberDataUAE', memebersDataSchemaUAE)

const getMemberDataDBUAE = async(tenantId) =>{
    const dbName = `Tenant-${tenantId}`
    db = db ? db : await connectDB(url)
    let tenantDb = db.useDb(dbName, { useCache: true });
    return tenantDb;
  }
  const getMemberDataModelUAE = async (tenantId) => {
    const tenantDb = await getMemberDataDBUAE(tenantId);
    return tenantDb.model("memberDataUAE", memebersDataSchemaUAE)
  }

  module.exports=getMemberDataModelUAE