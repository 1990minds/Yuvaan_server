const express = require('express')
const { registerAdmin,login,getAllAdmin,getOneAdmin,updateAdmin,deleteAdmin,isAuthenticateAdmin,adminProfile } = require('../controller/admin')
 const adminRouter = express.Router()

adminRouter.post('/admin',registerAdmin)
adminRouter.post('/adminAuth', login)
adminRouter.get('/admin',getAllAdmin)
adminRouter.get('/admin/:id',getOneAdmin)
adminRouter.put('/admin/:id', updateAdmin)
adminRouter.delete('/admin/:id',deleteAdmin)



adminRouter.get('/adminProfile',isAuthenticateAdmin,adminProfile)

 module.exports= adminRouter