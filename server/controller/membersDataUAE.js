
const xlsx = require('xlsx')
const fs = require('fs')
const getMemberDataModelUAE = require('../model/membersDataUAE')
const getEmployerModel = require('../model/employer')

// exports.uploadMembersDataUAE = async (req, res) => {
//     const tenantID = req.params.tenantID;

//     const ClaimsData = await getMemberDataModelUAE(tenantID);
//     if (req.error || !req.file.filename) {
//         return res.status(500).json({ msg: "Excel file Only" });
//     }
//     let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);

//     const columns = {
//         employeeId: 0,
//         beneficiaryMemberNo: 1,
//         beneficiaryName: 2,
//         dateOfBirth: 3,
//         gender: 4,
//         relationship: 5,
//         group_clientName: 6,
//         currentAnnualLimit: 7,
//         newOrProposedSumInsured: 8,
//         networkClassification: 9,
//         category: 10,
//         memberNationality: 11,
//         memberEmirate: 12,
//         regulatoy: 13,
//         anyOtherImportantFlag: 14,



//     };

//     let sheet = workbook.Sheets[workbook.SheetNames[0]];

//     const range = xlsx?.utils?.decode_range(sheet["!ref"]);
//     const extractedData = [];
//     let claimsAll = [];
//     let messages = [];

//     for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
//         const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
//         if (row) {
//             const rowData = {
//                 employeeId:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.employeeId })]
//                         ?.w || "",
//                 beneficiaryMemberNo:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryMemberNo })
//                     ]?.w || "",
//                 beneficiaryName:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryName })
//                     ]?.w || "",
//                 dateOfBirth:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.dateOfBirth })]
//                         ?.w || "",
//                 gender:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.gender })]
//                         ?.w || "",
//                 relationship:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.relationship })]
//                         ?.w || "",
//                 group_clientName:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.group_clientName })]
//                         ?.w || "",
//                 currentAnnualLimit:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.currentAnnualLimit })
//                     ]?.w || "",
//                 newOrProposedSumInsured:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.newOrProposedSumInsured })]
//                         ?.w || "",
//                 networkClassification:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.networkClassification })
//                     ]?.w || "",
//                 category:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.category })
//                     ]?.w || "",
//                 memberNationality:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.memberNationality })
//                     ]?.w || "",
//                 memberEmirate:
//                     sheet[
//                         xlsx.utils.encode_cell({ r: rowNum, c: columns.memberEmirate })
//                     ]?.w || "",
//                 regulatoy:
//                     sheet[
//                         xlsx.utils.encode_cell({
//                             r: rowNum,
//                             c: columns.regulatoy,
//                         })
//                     ]?.w || "",
//                 anyOtherImportantFlag:
//                     sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.anyOtherImportantFlag })]
//                         ?.w || "",
//                 tenantId: tenantID,
//             };

//             extractedData.push(rowData);
//         } else {
//             fs.unlink(`./uploads/${req.file.filename}`, function (err) {
//                 if (err) throw err;
//                 console.log("File deleted!", req.file.filename);
//             });
//             return res.status(400).json({ msg: "please upload details correctly" });
//         }
//     }

//     const dbdata = await ClaimsData.find();
//     console.log(extractedData.length);

//     for (let eachClaim = 0; eachClaim < extractedData.length; eachClaim++) {
//         let foundMatch = false;

//         if (dbdata.length <= 0) {
//             const claimsData = await ClaimsData.create(extractedData[eachClaim]);
//             claimsAll.push(claimsData);
//         }
//         else {
//             for (let i = 0; i < dbdata.length; i++) {
//                 const existClaim = dbdata[i];

//                 const dbEmployeeClaimNumber = existClaim?.employeeId;
//                 const excelEmployeeClaimNumber = extractedData[eachClaim]?.employeeId;
//                 console.log("141", excelEmployeeClaimNumber);
//                 console.log("claim", dbEmployeeClaimNumber, excelEmployeeClaimNumber);

//                 if (dbEmployeeClaimNumber === excelEmployeeClaimNumber) {
//                     foundMatch = true;

//                     console.log("Match found", eachClaim);

//                     await ClaimsData.updateOne(
//                         { ClaimNumber: dbEmployeeClaimNumber },
//                         extractedData[eachClaim]
//                     );
//                     console.log("Match found and updated", excelEmployeeClaimNumber);
//                     messages.push("Match found and updated");
//                     break;
//                 }
//             }

//             if (!foundMatch) {
//                 const claimsData = await ClaimsData.create(extractedData[eachClaim]);
//                 claimsAll.push(claimsData);
//                 messages.push('New claim added');
//             }
//         }
//     }

//     fs.unlink(`./uploads/${req.file.filename}`, function (err) {
//         if (err) throw err;
//         console.log("File deleted!", req.file.filename);
//     });

//     if (claimsAll.length === 0 && messages.length === 0) {
//         return res.status(302).json({ msg: "No new details to upload or error with excel details" });
//     }

//     return res.status(200).json({ msg: "Members data processed", details: messages, claimsAll });
// };

exports.uploadMembersDataUAE = async (req, res) => {
    try {
        const tenantID = req.params.tenantID;
        const ClaimsData = await getMemberDataModelUAE(tenantID);

        if (req.error || !req.file?.filename) {
            return res.status(500).json({ msg: "Excel file Only" });
        }

        const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = xlsx.utils.decode_range(sheet["!ref"]);
        const extractedData = [];
        let claimsAll = [];
        let messages = [];

        const columns = {
            employeeId: 0,
            beneficiaryMemberNo: 1,
            beneficiaryName: 2,
            dateOfBirth: 3,
            gender: 4,
            relationship: 5,
            group_clientName: 6,
            currentAnnualLimit: 7,
            newOrProposedSumInsured: 8,
            networkClassification: 9,
            category: 10,
            memberNationality: 11,
            memberEmirate: 12,
            regulatoy: 13,
            anyOtherImportantFlag: 14,
        };

        for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
            const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
            if (row && row.v !== undefined) {
                const rowData = {
                    employeeId: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.employeeId })]?.w || "",
                    beneficiaryMemberNo: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryMemberNo })]?.w || "",
                    beneficiaryName: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryName })]?.w || "",
                    dateOfBirth: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.dateOfBirth })]?.w || "",
                    gender: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.gender })]?.w || "",
                    relationship: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.relationship })]?.w || "",
                    group_clientName: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.group_clientName })]?.w || "",
                    currentAnnualLimit: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.currentAnnualLimit })]?.w || "",
                    newOrProposedSumInsured: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.newOrProposedSumInsured })]?.w || "",
                    networkClassification: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.networkClassification })]?.w || "",
                    category: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.category })]?.w || "",
                    memberNationality: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.memberNationality })]?.w || "",
                    memberEmirate: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.memberEmirate })]?.w || "",
                    regulatoy: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.regulatoy })]?.w || "",
                    anyOtherImportantFlag: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.anyOtherImportantFlag })]?.w || "",
                    tenantId: tenantID,
                };

                extractedData.push(rowData);
            } else {
                console.log(`Skipping empty row: ${rowNum}`);
            }
        }

        const dbdata = await ClaimsData.find();
      
        for (let eachClaim = 0; eachClaim < extractedData.length; eachClaim++) {
            let foundMatch = false;

            if (dbdata.length === 0) {
                const claimsData = await ClaimsData.create(extractedData[eachClaim]);
                claimsAll.push(claimsData);
            } else {
                for (let i = 0; i < dbdata.length; i++) {
                    const existClaim = dbdata[i];
                    const dbEmployeeClaimNumber = existClaim?.beneficiaryMemberNo;
                    const excelEmployeeClaimNumber = extractedData[eachClaim]?.beneficiaryMemberNo;
                    

                    if (dbEmployeeClaimNumber === excelEmployeeClaimNumber) {
                        foundMatch = true;
                      

                        await ClaimsData.updateOne(
                            { beneficiaryMemberNo: dbEmployeeClaimNumber },
                            extractedData[eachClaim]
                        );
                       
                        messages.push("Match found and updated");
                        break;
                    }
                }

                if (!foundMatch) {
                    const claimsData = await ClaimsData.create(extractedData[eachClaim]);
                    claimsAll.push(claimsData);
                    messages.push('New claim added');
                }
            }
        }


        // Identify and delete the members that are in dadabase but not in file
        const exctractedMembers = extractedData.map(memData => ClaimsData.beneficiaryMemberNo)
        const membersToDelete = dbdata.filter(dbMember => !exctractedMembers.includes(dbMember.beneficiaryMemberNo))

        for (const memb of membersToDelete) {
            await ClaimsData.deleteOne({ beneficiaryMemberNo: memb.beneficiaryMemberNo })
         
        }

        fs.unlink(`./uploads/${req.file.filename}`, function (err) {
            if (err) throw err;
            
        });

        if (claimsAll.length === 0 && messages.length === 0) {
            return res.status(302).json({ msg: "No new details to upload or error with excel details" });
        }

        return res.status(200).json({ msg: "Members data processed", details: messages, claimsAll });
    } catch (error) {
    
        res.status(500).json({ error: error.message || error.toString() });
    }
};






exports.getMembersDataUAE = async (req, res) => {

    const tenantID = req.params.tenantID
    try {
        const MembersData = await getMemberDataModelUAE(tenantID)
        const members = await MembersData.find()

      
        return res.status(200).json({ msg: "Members data fetched successfully", members })


    } catch (error) {
        console.log(error)

        return res.status(500).json({ msg: "Failed to fetch members" });
    }
}