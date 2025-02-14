
const xlsx = require('xlsx')
const fs = require('fs')
const getMemberDataModel = require('../model/membersData')
const getEmployerModel = require('../model/employer')

exports.uploadMemberData = async(req,res)=>{
  

    const tenantID = req.params.tenantID
  
       const MembersData = await getMemberDataModel(tenantID)
       if(req.error || !req?.file?.filename){
        return res.status(500).json({msg:'Excel file Only'})
    }
    let workbook = xlsx.readFile(`./uploads/${req.file.filename}`)
    
    const columns = {
        employeeId: 0,
        name: 1,
        dateOfBirth: 2,
        gender: 3,
        relationship: 4,
        entityName: 5,
        currentSumInsured: 6,
        newOrProposedSumInsured: 7,
        grade: 8,
        anyOtherImportantFlag: 9
    };
    
  
  
    let sheet = workbook.Sheets[workbook.SheetNames[0]]
    
  
    const range = xlsx.utils.decode_range(sheet['!ref'])
    const extractedData = []
    let membersAll = []
  
    for(let rowNum = range.s.r+1;rowNum <= range.e.r ;rowNum++){
        const row = sheet[xlsx.utils.encode_cell({r:rowNum,c:0})]
        if(row){
            const rowData = {
                EmployeeID:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.employeeId})]?.w ||'',
                Name:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.name})]?.w ||'',
                DateOfBirth:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.dateOfBirth})]?.w ||'',
                Gender:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.gender})]?.w ||'',
                Relationship:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.relationship})]?.w ||'',
                EntityName:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.entityName})]?.w ||'',
                CurrentSumInsured:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.currentSumInsured})]?.w ||'',
                NewOrProposedSumInsured:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.newOrProposedSumInsured})]?.w ||'',
                Grade:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.grade})]?.w ||'',
                AnyOtherImportantFlag:sheet[xlsx.utils.encode_cell({r:rowNum,c:columns.anyOtherImportantFlag})]?.w ||'',
                tenantId:tenantID
              }
           
            extractedData.push(rowData)
        }else{
           
            fs.unlink(`./uploads/${req.file.filename}`, function (err) {
                if (err) throw err;
               
                
            });
            return res.status(400).json({msg:"please upload details correctly"})
        }
       
    }
    const membersData = await MembersData.create(extractedData);
    membersAll.push(membersData);
    fs.unlink(`./uploads/${req.file.filename}`, function (err) {
        if (err) throw err;
       
    });
   membersAll.length <= 0? res.status(302).json({msg:"No New details to upload or error with excel details"}): res.status(200).json({msg:"Members data uploaded successfully",membersAll})
    
    
//     const dbdata = await MembersData.find()
//     console.log(extractedData.length) 
    
    
//     for (let eachMember = 0; eachMember < extractedData.length; eachMember++) {
//         let foundMatch = false;
    
//         if (dbdata.length <= 0) {
//             const membersData = await MembersData.create(extractedData[eachMember]);
//             membersAll.push(membersData);
//         } 
//         else {
//             for (let i = 0; i < dbdata.length; i++) {
//                 const existMember = dbdata[i];
    
//                 const dbMemberName = existMember.Name;
//                 const excelMemberName = extractedData[eachMember].Name;
//                 const dbMemeberId = existMember.EmployeeID
//                 const excelMemeberId = extractedData[eachMember].EmployeeID
               
//                 console.log(dbMemberName,excelMemberName)
//                 console.log(dbMemeberId,excelMemeberId)

              
    
//                 if (dbMemberName === excelMemberName && dbMemeberId === excelMemeberId) 
               
//               {
//                     foundMatch = true;
//                     console.log("Match found", eachMember);
//                     await MembersData.updateOne({EmployeeID:excelMemeberId},extractedData[eachMember])
//                     break; 
//                 }
//             }
    
//             if (!foundMatch) {
//                 const membersData = await MembersData.create(extractedData[eachMember]);
               
//                 membersAll.push(membersData);
//             }
//         }
//     }
    
    
//     fs.unlink(`./uploads/${req.file.filename}`, function (err) {
//         if (err) throw err;
//         console.log('File deleted!',req.file.filename);
//     });
//    membersAll.length <= 0? res.status(302).json({msg:"No New details to upload or error with excel details"}): res.status(200).json({msg:"Members data uploaded successfully",membersAll})
        
 
}



exports.getMembersData = async(req,res)=>{

    const tenantID = req.params.tenantID
    try{
        const MembersData = await getMemberDataModel(tenantID)
        const members = await MembersData.find()
        return res.status(200).json({msg:"Members data fetched successfully",members})


    }catch(error){
       
 return res.status(500).json({ msg: "Failed to fetch members" });
    }
}