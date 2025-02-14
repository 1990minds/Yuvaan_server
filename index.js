const express = require('express')
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors')
const connectDB = require("./config/db");
const dotenv =  require('dotenv')
const path = require('path')
const employee = require('./server/router/employees')
const supplier = require('./server/router/supplier')
const admin = require('./server/router/admin')
const employer = require('./server/router/employer')
const product = require('./server/router/product')
const emloyerOrder = require('./server/router/employerOrders')
const supo = require('./server/router/supplierOrder')
const micrositeProducts = require('./server/router/marketPlace')
const category = require('./server/router/categories')
const quote = require('./server/router/quotations')
const member = require('./server/router/membersData')
const memberUAE = require('./server/router/membersDataUAE')
const claim = require('./server/router/claimsData')
const claimUAE = require('./server/router/claimsDataUAE')
const analysis = require('./server/router/analysisData')
const analysisUAE = require('./server/router/analysisDataUAE')
const rfq = require('./server/router/rfq')
const rfqUAE = require('./server/router/rfqUAE')
const someinfo = require('./server/router/RjacExternal')
const notification = require('./server/router/notification')
const documentfile = require('./server/router/documentCenter')
const user = require('./server/router/user')
const message = require('./server/router/messagingSystem') 
const ticket = require('./server/router/ticketManagement')
const employeeBudget = require('./server/router/empBudget')
const ticketMessage = require('./server/router/ticketMessage')
const employeeUAE = require ('./server/router/employeeUAE')
const employerOnboard = require('./server/router/employerOnboard')
const empInterestPro = require('./server/router/empIntersetProduct')
const empRewardRatio = require('./server/router/employerRewardsRatio')
const employeeOrder = require('./server/router/employeeOrder')
// const employeeRewards = require('./server/router/rewards')
const insuranceRequest = require('./server/router/InsuranceRequest')
const preAuthRequest = require('./server/router/preAuthReq')
const insurer = require('./server/router/insurerAuth')
const insurerOrder = require('./server/router/insurerOrder')
const employerOnboardYuvaan = require('./server/router/employerOnboardYuvaan')
const specialProductRoutes = require('./server/router/specialProducts');
const subProductRoutes = require('./server/router/subProducts');
const WellnessServiceRoutes = require('./server/router/wellnessService');











dotenv.config();
connectDB();
 const app = express()
 app.use(helmet({
  directives: {
    defaultSrc: ["'self'"], //content from the same origin or current domain is allowed
    scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdnjs.cloudflare.com'],
    
  }
  
 }))

 app.use(express.json())
 app.use(cors())
 
 if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
  }
//   app.use(cookieSession({
//   maxAge:24*60*60*1000,
//   keys:[process.env.COOKEY_KEY] 
//   }))



  app.use('/static', express.static(path.join(__dirname, './server/uploads')))

  const PORT = process.env.PORT||5000;
  const server = app.listen(PORT,
  console.log(`Server running on PORT ${PORT}...`)
  );
  app.use('/api',admin)
  app.use('/api',supplier)
  app.use('/api',employer)
  app.use('/api',employee)
  app.use('/api',product)
  app.use('/api',emloyerOrder)
  app.use('/api',supo)
  app.use('/api',category)
  app.use('/api',quote)
  app.use('/api',member)
  app.use('/api',memberUAE)
  app.use('/api',claim)
  app.use('/api',claimUAE)
  app.use('/api',analysis)
  app.use('/api',analysisUAE)
  app.use('/api',rfq)
  app.use('/api',rfqUAE)
  app.use('/api',micrositeProducts)
  app.use('/api',someinfo)
  app.use('/api',notification)
  app.use('/api',documentfile)
  app.use('/api',user)
  app.use('/api',message)
  app.use('/api',ticket)
  app.use('/api',employeeBudget)
  app.use('/api',ticketMessage)
  app.use('/api',employeeUAE)
  app.use('/api',employerOnboard)
  app.use('/api',empInterestPro)
  app.use('/api',empRewardRatio)
  app.use('/api',employeeOrder)
  app.use('/api',insuranceRequest)
  app.use('/api',preAuthRequest)
  app.use('/api',insurer)
  app.use('/api',insurerOrder)
  app.use('/api',employerOnboardYuvaan)
  app.use('/api',specialProductRoutes)
  app.use('/api',subProductRoutes)
  app.use('/api',WellnessServiceRoutes)








  // app.use('/api',employeeRewards)





  



