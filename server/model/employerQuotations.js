const mongoose = require('mongoose')
const connectDB = require('../../config/db')



const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema

const employerQuoteSchema = new Schema({

  
    employer:{
        type:Schema.Types.ObjectId,
        ref:"employer"
    },
      

      generated_quotation: {
        type: Object, 
        },
  



        

},{timestamps:true,createdAt: 'createdAt', updatedAt: 'updatedAt'})
// module.exports = mongoose.model('employerOrders',orderSchema)


const employerQuoteModel= mongoose.model('employerQuotes', employerQuoteSchema)


const getEmployerQuoteDB = async(tenantId) =>{
    const dbName = `Tenant-${tenantId}`
    db = db ? db : await connectDB(url)
    let tenantDb = db.useDb(dbName, { useCache: true });
    return tenantDb;
  }


  const getEmployerQuotationModel = async (tenantId) => {
    const tenantDb = await getEmployerQuoteDB(tenantId);
    return tenantDb.model("employerQuotes", employerQuoteSchema)
  }
  

  module.exports = getEmployerQuotationModel
