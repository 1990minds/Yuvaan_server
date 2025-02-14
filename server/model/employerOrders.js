const mongoose = require('mongoose')
const connectDB = require('../../config/db')



const url = "mongodb+srv://corporatesolutions:0ftDgP7mxfUdrSPW@cluster0.vi29fgh.mongodb.net";
let db;

const Schema = mongoose.Schema

const orderSchema = new Schema({

  
    employer:{
        type:Schema.Types.ObjectId,
        ref:"employer"
    },
      

      orders: [{
        type: Object, 
        ref: "SupplierOrder"
}],
  



},{timestamps:true,createdAt: 'createdAt', updatedAt: 'updatedAt'})
// module.exports = mongoose.model('employerOrders',orderSchema)


const employerOrderModel= mongoose.model('employerOrders', orderSchema)


const getEmployerOrderDB = async(tenantId) =>{
    const dbName = `Tenant-${tenantId}`
    db = db ? db : await connectDB(url)
    let tenantDb = db.useDb(dbName, { useCache: true });
    return tenantDb;
  }


  const getEmployerOrderModel = async (tenantId) => {
    const tenantDb = await getEmployerOrderDB(tenantId);
    return tenantDb.model("employerOrders", orderSchema)
  }
  

  module.exports = getEmployerOrderModel
