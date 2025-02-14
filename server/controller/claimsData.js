const xlsx = require("xlsx");
const fs = require("fs");
const getClaimDataModel = require("../model/claimsData");
const getEmployerModel = require("../model/employer");

const getAnalysisModel = require("../model/analysisData");
const getMemberDataModel = require('../model/membersData')
const getRFQModel = require("../model/rfq");
const axios = require("axios");
const getEmployeeModel = require("../model/employees")


exports.uploadCliamData = async (req, res) => {
  const tenantID = req.params.tenantID;

  const ClaimsData = await getClaimDataModel(tenantID);
  if (req.error || !req.file.filename) {
    return res.status(500).json({ msg: "Excel file Only" });
  }
  let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);

  const columns = {
    policyNumber: 0,
    policyholderName: 1,
    policyStartDate: 2,
    policyEndDate: 3,
    employeeId: 4,
    employeeName: 5,
    beneficiaryId: 6,
    beneficiaryName: 7,
    relationship: 8,
    baseSumInsured: 9,
    topUpSumInsured: 10,
    totalSumInsured: 11,
    beneficiaryGender: 12,
    beneficiaryDateOfBirth: 13,
    claimNumber: 14,
    treatmentAdmissionDate: 15,
    dischargeDate: 16,
    settledDate: 17,
    claimStatus: 18,
    claimedAmount: 19,
    settledSanctionedAmount: 20,
    outstanding: 21,
    incurredAmount: 22,
    icdCode: 23,
    diseaseCategory: 24,
    coPay: 25,
    roomRent: 26,
    maternity: 27,
    bufferUtilization: 28,
    criticalIllness: 29,
    serviceType: 30,
    claimType: 31,
    providerHospitalName: 32,
    providerCity: 33,
  };

  let sheet = workbook.Sheets[workbook.SheetNames[0]];

  const range = xlsx?.utils?.decode_range(sheet["!ref"]);
  const extractedData = [];
  let claimsAll = [];
  let messages = [];

  for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
    const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
    if (row) {
      const rowData = {
        PolicyNumber:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.policyNumber })]
            ?.w || "",
        PolicyholderName:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.policyholderName })
          ]?.w || "",
        PolicyStartDate:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.policyStartDate })
          ]?.w || "",
        PolicyEndDate:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.policyEndDate })]
            ?.w || "",
        EmployeeID:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.employeeId })]
            ?.w || "",
        EmployeeName:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.employeeName })]
            ?.w || "",
        BeneficiaryID:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryId })]
            ?.w || "",
        BeneficiaryName:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryName })
          ]?.w || "",
        Relationship:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.relationship })]
            ?.w || "",
        BaseSumInsured:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.baseSumInsured })
          ]?.w || "",
        TopUpSumInsured:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.topUpSumInsured })
          ]?.w || "",
        TotalSumInsured:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.totalSumInsured })
          ]?.w || "",
        BeneficiaryGender:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.beneficiaryGender })
          ]?.w || "",
        BeneficiaryDateOfBirth:
          sheet[
            xlsx.utils.encode_cell({
              r: rowNum,
              c: columns.beneficiaryDateOfBirth,
            })
          ]?.w || "",
        ClaimNumber:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.claimNumber })]
            ?.w || "",
        TreatmentAdmissionDate:
          sheet[
            xlsx.utils.encode_cell({
              r: rowNum,
              c: columns.treatmentAdmissionDate,
            })
          ]?.w || "",
        DischargeDate:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.dischargeDate })]
            ?.w || "",
        SettledDate:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.settledDate })]
            ?.w || "",
        ClaimStatus:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.claimStatus })]
            ?.w || "",
        ClaimedAmount:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.claimedAmount })]
            ?.w || "",
        SettledSanctionedAmount:
          sheet[
            xlsx.utils.encode_cell({
              r: rowNum,
              c: columns.settledSanctionedAmount,
            })
          ]?.w || "",
        Outstanding:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.outstanding })]
            ?.w || "",
        IncurredAmount:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.incurredAmount })
          ]?.w || "",
        ICDCode:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.icdCode })]?.w ||
          "",
        DiseaseCategory:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.diseaseCategory })
          ]?.w || "",
        CoPay:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.coPay })]?.w ||
          "",
        RoomRent:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.roomRent })]
            ?.w || "",
        Maternity:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.maternity })]
            ?.w || "",
        BufferUtilization:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.bufferUtilization })
          ]?.w || "",
        CriticalIllness:
          sheet[
            xlsx.utils.encode_cell({ r: rowNum, c: columns.criticalIllness })
          ]?.w || "",
        ServiceType:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.serviceType })]
            ?.w || "",
        ClaimType:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.claimType })]
            ?.w || "",
        ProviderHospitalName:
          sheet[
            xlsx.utils.encode_cell({
              r: rowNum,
              c: columns.providerHospitalName,
            })
          ]?.w || "",
        ProviderCity:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.providerCity })]
            ?.w || "",
        tenantId: tenantID,
      };

      extractedData.push(rowData);
    } else {
      fs.unlink(`./uploads/${req.file.filename}`, function (err) {
        if (err) throw err;
        // console.log("File deleted!", req.file.filename);
      });
      return res.status(400).json({ msg: "please upload details correctly" });
    }
  }

  const dbdata = await ClaimsData.find();
  // console.log(extractedData.length);

  for (let eachClaim = 0; eachClaim < extractedData.length; eachClaim++) {
    let foundMatch = false;

    if (dbdata.length <= 0) {
      const claimsData = await ClaimsData.create(extractedData[eachClaim]);
      claimsAll.push(claimsData);
    }
    else {
      for (let i = 0; i < dbdata.length; i++) {
        const existClaim = dbdata[i];

        const dbEmployeeClaimNumber = existClaim?.ClaimNumber;
        const excelEmployeeClaimNumber = extractedData[eachClaim]?.ClaimNumber;
        // console.log("141", excelEmployeeClaimNumber);
        // console.log("claim", dbEmployeeClaimNumber, excelEmployeeClaimNumber);

        if (dbEmployeeClaimNumber === excelEmployeeClaimNumber) {
          foundMatch = true;

          // console.log("Match found", eachClaim);

          await ClaimsData.updateOne(
            { ClaimNumber: dbEmployeeClaimNumber },
            extractedData[eachClaim]
          );
          // console.log("Match found and updated", excelEmployeeClaimNumber);
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

  fs.unlink(`./uploads/${req.file.filename}`, function (err) {
    if (err) throw err;
    // console.log("File deleted!", req.file.filename);
  });

  if (claimsAll.length === 0 && messages.length === 0) {
    return res.status(302).json({ msg: "No new details to upload or error with excel details" });
  }

  return res.status(200).json({ msg: "Claims data processed", details: messages, claimsAll });
};


exports.calculateClaimsData = async (req, res) => {
  const tenantID = req.params.tenantID;
  try {

    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();

    const totalClaimAmount = claims.reduce((total, claim) => {
      const claimedAmount = parseFloat(claim.ClaimedAmount.replace(/,/g, ""));

      return total + claimedAmount;
    }, 0);

  

    const totalClaimIncurredAmount = claims.reduce((total, claim) => {
      const claimedAmount = parseFloat(claim.IncurredAmount.replace(/,/g, ""));

      return total + claimedAmount;
    }, 0);

    // console.log("total incurred amount", totalClaimIncurredAmount);

    const cashlessClaims = claims.filter(
      (item) => item.ClaimType === "CASHLESS"
    );
    const totalCashlessClaimAmount = cashlessClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);

    // console.log("Total Cashless Claim Amount:", totalCashlessClaimAmount);

    const cashlessClimedAmountPercentage =
      (totalCashlessClaimAmount / totalClaimAmount) * 100;
   
    const cashlessClaimAmountPercentage =
      cashlessClimedAmountPercentage.toFixed(2) + "%";

    const totalCliams = claims?.length;
   
    const cashlessNoOfClaims = cashlessClaims?.length;
    const cashlessClaimNumberPercentage =
      ((cashlessNoOfClaims / totalCliams) * 100).toFixed(2) + "%";
 ;

    const totalCashlessIncurredAmount = cashlessClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    //   console.log("number of centage",Math.min(parseFloat(cashlessClaimNumberPercentage,100)))

    const cashlessIncurredAmountPercentage =
      ((totalCashlessIncurredAmount / totalClaimIncurredAmount) * 100).toFixed(
        2
      ) + "%";

   




    //cashless cancelledsttaus
    const cashlessCancelledClaims = claims.filter(
      (item) => item.ClaimType === "CASHLESS" && item.ClaimStatus === "Cancelled"
    );
  
    const totalcashlessCancelledClaims = cashlessCancelledClaims.length

    const cashlessCancelleNumberpercentage = (totalcashlessCancelledClaims / cashlessNoOfClaims * 100).toFixed(2) + '%'



    const totalCashlessCancelledClaimAmount = cashlessCancelledClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
  

    const cashlessCancelledclaimAmountPercentage = (totalCashlessCancelledClaimAmount / totalCashlessClaimAmount * 100).toFixed(2) + "%"

    const totalCashlessCancelldIncurredAmount = cashlessCancelledClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const cashlessCancelledIncurpercentage = (totalCashlessCancelldIncurredAmount / totalClaimIncurredAmount * 100).toFixed(2) + "%"



    //cashless settled
    const cashlessSettledClaims = claims.filter(
      (item) => item.ClaimType === "CASHLESS" && item.ClaimStatus === "Settled"
    );
    
    const totalCashlessSettledClaims = cashlessSettledClaims.length

    const cashlessSettledNumberpercentage = (totalCashlessSettledClaims / cashlessNoOfClaims * 100).toFixed(2) + '%'



    const totalCashlessSettledClaimAmount = cashlessSettledClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
  

    const cashlessSettledclaimAmountPercentage = (totalCashlessSettledClaimAmount / totalCashlessClaimAmount * 100).toFixed(2) + "%"

    const totalCashlessSettledIncurredAmount = cashlessSettledClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const cashlessSettledIncurpercentage = (totalCashlessSettledIncurredAmount / totalClaimIncurredAmount * 100).toFixed(2) + "%"




    //cashless Repudiated
    const cashlessRepudiatedClaims = claims.filter(
      (item) => item.ClaimType === "CASHLESS" && item.ClaimStatus === "Repudiated"
    );
 
    const totalCashlessRepudiatedClaims = cashlessRepudiatedClaims.length

    const cashlessRepudiatedNumberpercentage = (totalCashlessRepudiatedClaims / cashlessNoOfClaims * 100).toFixed(2) + '%'



    const totalCashlessRepudiatedClaimAmount = cashlessRepudiatedClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
   

    const cashlessRepudiatedclaimAmountPercentage = (totalCashlessRepudiatedClaimAmount / totalCashlessClaimAmount * 100).toFixed(2) + "%"

    const totalCashlessRepudiatedIncurredAmount = cashlessRepudiatedClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const cashlessRepudiatedIncurpercentage = (totalCashlessRepudiatedIncurredAmount / totalClaimIncurredAmount * 100).toFixed(2) + "%"





    //cashless UnderProcess
    const cashlessUnderProcessClaims = claims.filter(
      (item) => item.ClaimType === "CASHLESS" && item.ClaimStatus === "Under Process"
    );

    const totalCashlessUnderProcessClaims = cashlessUnderProcessClaims.length

    const cashlessUnderProcessNumberpercentage = (totalCashlessUnderProcessClaims / cashlessNoOfClaims * 100).toFixed(2) + '%'



    const totalCashlessUnderProcessClaimAmount = cashlessUnderProcessClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
   

    const cashlessUnderProcessclaimAmountPercentage = (totalCashlessUnderProcessClaimAmount / totalCashlessClaimAmount * 100).toFixed(2) + "%"

    const totalCashlessUnderProcessIncurredAmount = cashlessUnderProcessClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const cashlessUnderProcessIncurpercentage = (totalCashlessUnderProcessIncurredAmount / totalClaimIncurredAmount * 100).toFixed(2) + "%"


    //REIMBURSEMENT

    const reimbursementClaims = claims.filter(
      (item) => item.ClaimType === "REIMBURSEMENT"
    );

    const totalreimbursementClaims = reimbursementClaims.length
   
    const totalreimbursementClaimAmount = reimbursementClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);

   

    const reimburseNumberPercentage =
      ((totalreimbursementClaims / totalCliams) * 100).toFixed(2) + "%";



    const reimbursementClimedAmountPercentage =
      (totalreimbursementClaimAmount / totalClaimAmount) * 100;

    const reimbursementClaimAmountPercentage =
      reimbursementClimedAmountPercentage.toFixed(2) + "%";


    const reimbursementNoOfClaims = reimbursementClaims?.length;
    const reimbursementClaimNumberPercentage =
      ((reimbursementNoOfClaims / totalCliams) * 100).toFixed(2) + "%";


    const totalReimbursementIncurredAmount = reimbursementClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    //   console.log("number of centage",Math.min(parseFloat(cashlessClaimNumberPercentage,100)))

    const reimbursementIncurredAmountPercentage =
      ((totalReimbursementIncurredAmount / totalClaimIncurredAmount) * 100).toFixed(
        2
      ) + "%";

   



    //cancelledsttaus
    const reimbursementCancelledClaims = claims.filter(
      (item) => item.ClaimType === "REIMBURSEMENT" && item.ClaimStatus === "Cancelled"
    );
   
    const totalreimbursementCancelledClaims = reimbursementCancelledClaims.length

    const reimbursementCanceledNumberpercentage = (totalreimbursementCancelledClaims / totalreimbursementClaims * 100).toFixed(2) + '%'



    const totalReimbursementCancelledClaimAmount = reimbursementCancelledClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
 

    const reimbursementCancelledclaimAmountPercentage = (totalReimbursementCancelledClaimAmount / totalreimbursementClaimAmount * 100).toFixed(2) + "%"

    const totalreimbursementCancelldIncurredAmount = reimbursementCancelledClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const rembursementCancelledIncurpercentage = (totalreimbursementCancelldIncurredAmount / totalReimbursementIncurredAmount * 100).toFixed(2) + "%"


    //Repudiated sttaus
    const RepudiatedCancelledClaims = claims.filter(
      (item) => item.ClaimType === "REIMBURSEMENT" && item.ClaimStatus === "Repudiated"
    );
 
    const totalreimbursementRepudiatedClaims = RepudiatedCancelledClaims.length

    const reimbursementRepudiatedNumberpercentage = (totalreimbursementRepudiatedClaims / totalreimbursementClaims * 100).toFixed(2) + '%'



    const totalReimbursementRepudiatedClaimAmount = RepudiatedCancelledClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
  

    const reimbursementRepudiatedclaimAmountPercentage = (totalReimbursementRepudiatedClaimAmount / totalreimbursementClaimAmount * 100).toFixed(2) + "%"

    const totalreimbursementRepudiatedIncurredAmount = reimbursementCancelledClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const rembursementRepudiatedIncurpercentage = (totalreimbursementRepudiatedIncurredAmount / totalReimbursementIncurredAmount * 100).toFixed(2) + "%"





    //settled sttaus
    const reimbersementSettledClaims = claims.filter(
      (item) => item.ClaimType === "REIMBURSEMENT" && item.ClaimStatus === "Settled"
    );
  
    const totalreimbursementSettledClaims = reimbersementSettledClaims.length

    const reimbursementSettledumberpercentage = (totalreimbursementSettledClaims / totalreimbursementClaims * 100).toFixed(2) + '%'



    const totalReimbursementSettledClaimAmount = reimbersementSettledClaims.reduce((total, claim) => {
      return total + parseFloat(claim.ClaimedAmount.replace(/,/g, ""));
    }, 0);
  

    const reimbursementSettledclaimAmountPercentage = (totalReimbursementSettledClaimAmount / totalreimbursementClaimAmount * 100).toFixed(2) + "%"

    const totalreimbursettledIncurredAmount = reimbersementSettledClaims.reduce(
      (total, claim) => {
        return total + parseFloat(claim.IncurredAmount.replace(/,/g, ""));
      },
      0
    );

    const rembursementSettledIncurpercentage = (totalreimbursettledIncurredAmount / totalReimbursementIncurredAmount * 100).toFixed(2) + "%"

    //relations
    const totalRelationShipClaims = claims.filter((item) => item.Relationship)
    const totalrelationshipclaims = totalRelationShipClaims?.length

    const realtionshipClaimedAmount = totalRelationShipClaims?.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount), 0)
    // console.log(realtionshipClaimedAmount)
    const realtionshipIncurredAmount = totalRelationShipClaims?.reduce((acc, item) => acc + parseFloat(item?.IncurredAmount), 0)
    // console.log("613", realtionshipIncurredAmount)


    const daugterRelationClaims = await claims?.filter((item) => item.Relationship === "Daughter")
    // console.log(daugterRelationClaims.length)
    const daughterClaims = daugterRelationClaims.length
    const daughterClaimsClaimedAmount = daugterRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(daughterClaimsClaimedAmount)

    const daughterClaimsIncurredAmount = daugterRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(daughterClaimsIncurredAmount)



    const fatherRelationClaims = claims.filter((item) => item.Relationship === "Father")
    // console.log(fatherRelationClaims.length)
    const fatherClaims = fatherRelationClaims.length
    const fatherClaimsClaimedAmount = fatherRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(fatherClaimsClaimedAmount)

    const fatherClaimsIncurredAmount = fatherRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(fatherClaimsIncurredAmount)




    const motherRelationClaims = claims.filter((item) => item.Relationship === "Mother")
    // console.log(motherRelationClaims.length)
    const motherClaims = fatherRelationClaims.length
    const motherClaimsClaimedAmount = motherRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(motherClaimsClaimedAmount)

    const motherClaimsIncurredAmount = motherRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(motherClaimsIncurredAmount)



    const selfRelationClaims = claims.filter((item) => item.Relationship === "Self")
    // console.log(selfRelationClaims.length)
    const selfClaims = selfRelationClaims.length
    const selfClaimsClaimedAmount = selfRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(selfClaimsClaimedAmount)

    const selfClaimsIncurredAmount = selfRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(selfClaimsIncurredAmount)


    const sonRelationClaims = claims.filter((item) => item.Relationship === "Son")
    // console.log(sonRelationClaims.length)
    const sonClaims = sonRelationClaims.length
    const sonClaimsClaimedAmount = sonRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(sonClaimsClaimedAmount)

    const sonClaimsIncurredAmount = sonRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(sonClaimsIncurredAmount)




    const spouseRelationClaims = claims.filter((item) => item.Relationship === "Spouse")
    // console.log(spouseRelationClaims.length)
    const spouseClaims = spouseRelationClaims.length
    const spouseClaimsClaimedAmount = spouseRelationClaims.reduce((acc, item) => acc + parseFloat(item.ClaimedAmount.replace(/,/g, "")), 0)
    // console.log(spouseClaimsClaimedAmount)

    const spouseClaimsIncurredAmount = spouseRelationClaims.reduce((acc, item) => acc + parseFloat(item.IncurredAmount.replace(/,/g, "")), 0)
    // console.log(spouseClaimsIncurredAmount)


    //gender
    const totalGenderClaims = claims.filter((item) => item.BeneficiaryGender)
    const totalgenderclaims = totalGenderClaims.length
    // console.log(totalgenderclaims)
    const gendertotalCliamedAmount = totalGenderClaims.reduce((acc, claim) => acc + parseFloat(claim.ClaimedAmount), 0)
    const gendertotalIncurredAmount = totalGenderClaims.reduce((acc, claim) => acc + parseFloat(claim.IncurredAmount), 0)


    const maleClaims = totalGenderClaims.filter((item) => item.BeneficiaryGender === 'Male')
    const totalMaleClaims = maleClaims.length
    const maletotalCliamedAmount = maleClaims.reduce((acc, claim) => acc + parseFloat(claim.ClaimedAmount), 0)
    const maletotalIncurredAmount = maleClaims.reduce((acc, claim) => acc + parseFloat(claim.IncurredAmount), 0)


    const femaleClaims = totalGenderClaims.filter((item) => item.BeneficiaryGender === 'Female')
    const totalFemaleClaims = femaleClaims.length
    const femaletotalCliamedAmount = femaleClaims.reduce((acc, claim) => acc + parseFloat(claim.ClaimedAmount), 0)
    const femaletotalIncurredAmount = femaleClaims.reduce((acc, claim) => acc + parseFloat(claim.IncurredAmount), 0)

    //age


    const { responseData, grandTotal } = await getClaimsDataAnalysis(tenantID);
    // console.log('......................', responseData)

    const
      { top15CitiesByClaimed, roomRent_claims, totalAmountWithRoomRent,
        totalAmountWithBufferUtilization,
        totalAmountWithCriticalIllness,
        totalAmountWithMetarnity,
        maternity_claims,
        buffer_claims,
        critical_claims,
        totalcitiesClaimedAmount,
        totalcitiesIncurredAmount

      }
        = await getClaimsDataCategorySumAnalysis(tenantID)


    const {
      maleCount,
      femaleCount,
      totalGenderCount,
      childCount,
      employeeCount,
      parentCount,
      parent_in_lawCount,
      spouseCount,
      totalRelationshipCount,
      garde_ICount,
      grade_IICount,
      grade_IIICount,
      grade_IVCount,
      grade_VCount,
      grade_VICount,
      totalGradeCount,
      insuredDataArray,
      grandTotalCurrentInsured,
      grandTotalProposedInsured,
      grandTotalInsuredClaims,
      ageGroupClaims
    } = await getMembersDataAnalysis(tenantID)



    const {
      totalAmountWithoutCopay,
      totalAmountWithCopay,
      withCopayLength,
      withoutCopayLength
    } = await getClaimsDataCopayAnalysis(tenantID)


    const {
      top15ProvidersByClaimed,
      totalIncurredAmount,
      totalClaimedAmount
    } = await getProviderClaimAnalysis(tenantID)


    const {
      top15AilmentsByClaimed,
      totalDiseaseClaimedAmount,
      totalDiseaseIncurredAmount,
      grandTotalClaims

    } = await getAilmentClaimAnalysis(tenantID)


    const {
      Gross_Premium_with_Brokerage,
      Gross_Premium_without_Brokerage,
      Risk_Premium_based_on_burn,
      Ultimate_Loss_Ratio,
      annualised_claims,
      claims_average,
      cliam_incident_rate,
      inception_per_life_rate2

    } = await getRFQAnalysis(tenantID)



    const {
      totalEmployee,
      totalYearlySalary,
      averageAge,
      averagePastService,
      averageEntryAge,
      aggregratetotalDbo,
      aggregrateyear1,
      aggregrateyear2,
      aggregrateyear3,
      aggregrateyear4,
      aggregrateyear5,
      aggregrateyear6,
      salaryesca1st3years,
      salaryescafter3years,
      fixedAttrition,
      terminationAttrition,
      resignationAttrition,
      withdrawrateone,
      leavesArray,
      totalgraduity

    } = await getSomeInfo(tenantID)


    const {
      employeeDepartmentArray,
      grandTotalCount,
      employeePositionArray,
      grandTotalPositionCount
    } = await getEmployee(tenantID)



    const {
      positionSalaryRangeArray
    } = await getPositionSalaryRange(tenantID)


    const {
      top10Employeedata
    } = await getClaimSummaryOfEmployeeClaims(tenantID)


    const {
      employeeAges
  } = await calculateEachemployeeAge(tenantID)




    //....................................

    const analysisData = {
      tenant_id: tenantID,
      noOfClaims: {
        grandTotal: {
          claims: totalCliams,
          claimedAmount: totalClaimAmount,
          incurredAmount: totalClaimIncurredAmount


        },
        cashless: {
          cancelled: totalcashlessCancelledClaims,
          repudiated: totalCashlessRepudiatedClaims,
          inProgress: totalCashlessUnderProcessClaims,
          settled: totalCashlessSettledClaims,
          total: cashlessNoOfClaims,
          claim_number_percent: cashlessClaimNumberPercentage

        },
        reimbursement: {
          cancelled: totalreimbursementCancelledClaims,
          repudiated: totalreimbursementRepudiatedClaims,

          settled: totalreimbursementSettledClaims,
          total: reimbursementNoOfClaims,
          claim_number_percent: reimburseNumberPercentage
        }
      },


      noOfClaimsPercentage: {
        cashlessPercentage: {
          cancelledPercentage: cashlessCancelleNumberpercentage,
          repudiatedPercentage: cashlessRepudiatedNumberpercentage,
          inProgressPercentage: cashlessUnderProcessNumberpercentage,
          settledPercentage: cashlessSettledNumberpercentage

        },
        reimbursementPercentage: {
          cancelledPercentage: reimbursementCanceledNumberpercentage,
          repudiatedPercentage: reimbursementRepudiatedNumberpercentage,

          settledPercentage: reimbursementSettledumberpercentage
        }
      },
      claimAmount: {
        cashless: {
          cancelled: totalCashlessCancelledClaimAmount,
          repudiated: totalCashlessRepudiatedClaimAmount,
          inProgress: totalCashlessUnderProcessClaimAmount,
          settled: totalCashlessSettledClaimAmount,
          toatalAmount: totalCashlessClaimAmount,
        },
        reimbursement: {
          cancelled: totalReimbursementCancelledClaimAmount,
          repudiated: totalReimbursementRepudiatedClaimAmount,

          settled: totalReimbursementSettledClaimAmount,
          toatalAmount: totalreimbursementClaimAmount,
        }
      },
      incurredAmount: {
        cashless: {
          cancelled: totalCashlessCancelldIncurredAmount,
          repudiated: totalCashlessRepudiatedIncurredAmount,
          inProgress: totalCashlessUnderProcessIncurredAmount,
          settled: totalCashlessSettledIncurredAmount,
          toatalAmount: totalCashlessIncurredAmount,

        },
        reimbursement: {
          cancelled: totalreimbursementCancelldIncurredAmount,
          repudiated: totalreimbursementRepudiatedIncurredAmount,

          settled: totalreimbursettledIncurredAmount,
          toatalAmount: totalReimbursementIncurredAmount,

        }
      },



      claimAmountPercentage: {
        cashlessPercentage: {
          cancelledPercentage: cashlessCancelledclaimAmountPercentage,
          repudiatedPercentage: cashlessRepudiatedclaimAmountPercentage,
          inProgressPercentage: cashlessUnderProcessclaimAmountPercentage,
          settledPercentage: cashlessSettledclaimAmountPercentage,
          totalPercentage: cashlessClaimAmountPercentage
        },
        reimbursementPercentage: {
          cancelledPercentage: reimbursementCancelledclaimAmountPercentage,
          repudiatedPercentage: reimbursementRepudiatedclaimAmountPercentage,

          settledPercentage: reimbursementSettledclaimAmountPercentage,
          totalPercentage: reimbursementClaimAmountPercentage
        }
      },


      incurredAmountPercentage: {
        cashlessPercentage: {
          cancelledPercentage: cashlessCancelledIncurpercentage,
          repudiatedPercentage: cashlessRepudiatedIncurpercentage,
          inProgressPercentage: cashlessUnderProcessIncurpercentage,
          settledPercentage: cashlessSettledIncurpercentage,
          totalPercentage: cashlessIncurredAmountPercentage
        },
        reimbursementPercentage: {
          cancelledPercentage: rembursementCancelledIncurpercentage,
          repudiatedPercentage: rembursementRepudiatedIncurpercentage,

          settledPercentage: rembursementSettledIncurpercentage,
          totalPercentage: reimbursementIncurredAmountPercentage
        }
      },

      relationships: {

        grandTotal: {
          claims: totalrelationshipclaims,
          claimedAmount: realtionshipClaimedAmount,
          incurredAmount: realtionshipIncurredAmount,

        },
        Daughter: {
          claims: daughterClaims,
          claimedAmount: daughterClaimsClaimedAmount,
          incurredAmount: daughterClaimsIncurredAmount,

        },
        Father: {
          claims: fatherClaims,
          claimedAmount: fatherClaimsClaimedAmount,
          incurredAmount: fatherClaimsIncurredAmount,

        },
        Mother: {
          claims: motherClaims,
          claimedAmount: motherClaimsClaimedAmount,
          incurredAmount: motherClaimsIncurredAmount,

        },
        Self: {
          claims: selfClaims,
          claimedAmount: selfClaimsClaimedAmount,
          incurredAmount: selfClaimsIncurredAmount,

        },
        Son: {
          claims: sonClaims,
          claimedAmount: sonClaimsClaimedAmount,
          incurredAmount: sonClaimsIncurredAmount,

        },
        Spouse: {
          claims: spouseClaims,
          claimedAmount: spouseClaimsClaimedAmount,
          incurredAmount: spouseClaimsIncurredAmount,
        },
      },
      gender: {
        grandTotal: {
          claims: totalgenderclaims,
          claimedAmount: gendertotalCliamedAmount,
          incurredAmount: gendertotalIncurredAmount,

        },
        Female: {
          claims: totalFemaleClaims,
          claimAmount: femaletotalCliamedAmount,
          incurredAmount: femaletotalIncurredAmount

        },
        Male: {
          claims: totalMaleClaims,
          claimAmount: maletotalCliamedAmount,
          incurredAmount: maletotalIncurredAmount
        }
      },
      ageCliams: {
        claimsByage: responseData,
        grandTotal: grandTotal
      },
      citiesByCliamed: {
        cityData: top15CitiesByClaimed,
        grandTotal: {
          claimAmount: totalcitiesClaimedAmount,
          incurrAmount: totalcitiesIncurredAmount
        }

      },
      claimsBycategory: {
        room_rent: {
          claims: roomRent_claims,
          amount: totalAmountWithRoomRent
        },
        maternity: {
          claims: maternity_claims,
          amount: totalAmountWithMetarnity
        },
        buffer_utilization: {
          claims: buffer_claims,
          amount: totalAmountWithBufferUtilization
        },
        critical_illness: {
          claims: critical_claims,
          amount: totalAmountWithCriticalIllness
        },

      },
      copay_claims: {
        with_copay: {
          claims: withCopayLength,
          amount: totalAmountWithCopay
        },
        without_copay: {
          claims: withoutCopayLength,
          amount: totalAmountWithoutCopay
        }

      },
      providerHospitalClaims: {
        providerData: top15ProvidersByClaimed,
        grandTotal: {
          claimAmount: totalClaimedAmount,
          incurrAmount: totalIncurredAmount
        }
      },
      ailmentClaims: {
        diseaseClaims: top15AilmentsByClaimed,
        grandTotal: {
          claimAmount: totalDiseaseClaimedAmount,
          incurrAmount: totalDiseaseIncurredAmount,
          totalClaims: grandTotalClaims
        }

      },


      membersData: {
        gender: {
          male: maleCount,
          female: femaleCount,
          total: totalGenderCount
        },
        relationshipInsured: {
          child: childCount,
          parent: parentCount,
          employee: employeeCount,
          parentinlaw: parent_in_lawCount,
          spouse: spouseCount,
          total: totalRelationshipCount
        },
        insuredByGrade: {
          grade_I: garde_ICount,
          grade_II: grade_IICount,
          grade_III: grade_IIICount,
          grade_IV: grade_IVCount,
          grade_V: grade_VCount,
          grade_VI: grade_VICount,
          total: totalGradeCount

        },
        Change_in_SA_from_previous_Year: {
          currentAndProposed: insuredDataArray,
          grandTotal: {
            proposed: grandTotalProposedInsured,
            totalClaims: grandTotalInsuredClaims
          }
        },
        Age_Band: ageGroupClaims


      },
      premiumData: {
        inceptionLifeRate: inception_per_life_rate2,
        claimIncidentRate: cliam_incident_rate,
        claimAverage: claims_average,
        annualClaims: annualised_claims,
        ultimateLossRatio: Ultimate_Loss_Ratio,
        riskPremiumBurn: Risk_Premium_based_on_burn,
        grossPremiumWithbrokerage: Gross_Premium_with_Brokerage,
        grossPremiumWithoutbrokerage: Gross_Premium_without_Brokerage
      },


      Rjac_values: {
        companyStatistics: {
          employee: {
            total_employee: totalEmployee,
            total_yearly_salary: totalYearlySalary,
            average_age: averageAge,
            average_past_service: averagePastService,
            average_entry_age: averageEntryAge,
          },
          gratuityLiability: {
            DBO: aggregratetotalDbo,
            year1: aggregrateyear1,
            year2: aggregrateyear2,
            year3: aggregrateyear3,
            year4: aggregrateyear4,
            year5: aggregrateyear5,
            year6: aggregrateyear6,
            total: totalgraduity
          },
          salaryEscalation: {
            First3year: salaryesca1st3years,
            After3year: salaryescafter3years,
          },
          AttritionRate: {
            fixedRate: fixedAttrition,
            // terminationRate:terminationAttrition,
            // resignationRate:resignationAttrition,

          },
          WithDrawRate: {
            withdrawRate1: withdrawrateone,

          },
        },
        Leaves: {
          leaves: leavesArray
        }
      },
      TcEmmployeeData: {
        employeeStructure: {
          Departments: {
            departments: employeeDepartmentArray,
            totalEmployeescount: grandTotalCount
          },
          Positions: {
            position: employeePositionArray,
            totalEmployees: grandTotalPositionCount,
            positionSlarayRange: positionSalaryRangeArray,
            positionWithAge: employeeAges


          }
        }

      },
      employees: top10Employeedata

    };




    const Analysis = await getAnalysisModel(tenantID);
    const newAnalysis = new Analysis(analysisData);
    await newAnalysis.save();

    // return res.status(200).json({ msg: "Analysis data saved successfully" });
  } catch (error) {
    throw error
    // return res.status(500).json({ msg: "Failed to fetch claims" });
  }
};

//feeeeeeeeeeeeeeeeeeeeching all claims

async function getClaimsDataAnalysis(tenantID) {

  try {
    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();


    function calculateAge(birthDate, endDate) {
      const millisecondsInYear = 1000 * 60 * 60 * 24 * 365;
      const ageInYears = Math.floor((endDate - birthDate) / millisecondsInYear);

      return ageInYears;
    }


    function filterClaimsByAgeRange(claims, startDate, endDate) {

      return claims.filter(item => {
        const endDateObj = new Date(item.PolicyEndDate);
        const birthDateObj = new Date(item.BeneficiaryDateOfBirth);
        const age = calculateAge(birthDateObj, endDateObj);



        if (startDate < 0) {
          return age === 0;
        }

        else {
          return age >= startDate && (endDate === "" || age < endDate);;
        }
      });
    }


    const ageRanges = [
      { start: -1, end: 0 },
      { start: 1, end: 15 },
      { start: 15, end: 30 },
      { start: 30, end: 45 },
      { start: 45, end: 60 },
      { start: 60, end: 75 },
      { start: 75, end: 85 }
    ];


    let grandTotalClaims = 0;
    let grandTotalIncurredAmount = 0;
    let grandTotalClaimedAmount = 0;
    let responseData = [];

    let grandTotal = []

    ageRanges.forEach(range => {
      const { start, end } = range;
      const rangeLabel = start === -1 ? "< 0" : `${start} - ${end === "" ? "∞" : end}`;
      // console.log(`Age Range ${rangeLabel}`);

      const filteredClaims = filterClaimsByAgeRange(claims, start, end);

      const totalClaims = filteredClaims.length;

      const totalIncurredAmount = filteredClaims.reduce((total, claim) => total + parseFloat(claim?.IncurredAmount), 0);
      const totalClaimedAmount = filteredClaims.reduce((total, claim) => total + parseFloat(claim?.ClaimedAmount), 0);

      grandTotalClaims += totalClaims;
      grandTotalIncurredAmount += totalIncurredAmount;
      grandTotalClaimedAmount += totalClaimedAmount;


      responseData.push({
        ageRange: rangeLabel,
        numberOfClaims: totalClaims,
        totalIncurredAmount: totalIncurredAmount,
        totalClaimedAmount: totalClaimedAmount
      });

      // console.log("Number of Claims1:", filteredClaims.length)
      // console.log("Total Incurred Amount1:", totalIncurredAmount);
      // console.log("Total Claimed Amount1:", totalClaimedAmount);

    });
    grandTotal.push({
      Number_of_Claims: grandTotalClaims,
      Incurred_Amount: grandTotalIncurredAmount,
      Claimed_Amount: grandTotalClaimedAmount

    })

    // console.log("Grand Total Number of Claims:", grandTotalClaims);
    // console.log("Grand Total Incurred Amount:", grandTotalIncurredAmount);
    // console.log("Grand Total Claimed Amount:", grandTotalClaimedAmount);
    return { responseData, grandTotal }

  } catch (error) {

    return res.status(500).json({ msg: "Failed to fetch claims" });
  }
};



async function getClaimSummaryOfEmployeeClaims(tenantID) {
  try {

    const ClaimsData = await getClaimDataModel(tenantID)
    const claims = await ClaimsData.find()

    const employeeData = {}
    let totalIncurredAmount = 0
    let totalcliams = 0

    claims.forEach(claim => {
      const emploeeid = claim.EmployeeID
      const incurredAmount = parseFloat(claim.IncurredAmount)
      const numclaims = 1
      totalIncurredAmount += incurredAmount
      totalcliams += numclaims

      if (emploeeid in employeeData) {
        employeeData[emploeeid].incurred_amount += incurredAmount
        employeeData[emploeeid].total_claims += numclaims

      } else {
        employeeData[emploeeid] = {
          incurred_amount: incurredAmount,
          total_claims: 1

        }
      }
    })

    const employeeArray = Object.entries(employeeData).map(([employee, data]) => ({
      Employee_ID: employee,
      incurred_Amount: data.incurred_amount,
      claims_total: data.total_claims


    }))

    const sortedEmployee = employeeArray.sort((a, b) => b.claims_total - a.claims_total)
    const top10Employeedata = sortedEmployee?.slice(0, 10)

    // console.log(" 1341", top10Employeedata)
    return {
      top10Employeedata
    }
  } catch (error) {
    throw error
  }
}





async function getClaimsDataCopayAnalysis(tenantID) {

  try {
    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();

    const claimsWithCopay = claims.filter(item => item.CoPay !== undefined && parseFloat(item.CoPay) !== 0);
    const claimsWithoutCopay = claims.filter(item => item.CoPay === undefined || parseFloat(item.CoPay) === 0);

    // console.log("Claims with copay:", claimsWithCopay.length);
    // console.log("Claims without copay:", claimsWithoutCopay.length);


    const withCopayLength = claimsWithCopay.length
    const withoutCopayLength = claimsWithoutCopay.length


    const totalAmountWithCopay = claimsWithCopay.reduce((total, claim) => {
      const copayValue = parseFloat(claim.CoPay);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);

    // console.log("Total amount with copay:", totalAmountWithCopay);

    const totalAmountWithoutCopay = claimsWithoutCopay.reduce((total, claim) => {
      const copayValue = parseFloat(claim.CoPay);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);

    // console.log("Total amount without copay:", totalAmountWithoutCopay);

    return { totalAmountWithoutCopay, totalAmountWithCopay, withCopayLength, withoutCopayLength }
    // res
    //   .status(200)
    //   .json({ msg: "Claims data copay fetched successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch claims" });
  }
};






async function getClaimsDataCategorySumAnalysis(tenantID) {
  // const tenantID = req.params.tenantID;
  try {
    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();

    const claimsWithRoomRent = claims.filter(item => item.RoomRent !== undefined && parseFloat(item.RoomRent) > 0);
    const claimsWithMaternity = claims.filter(item => item.Maternity !== undefined && parseFloat(item.Maternity) > 0);
    const claimsWithBufferUtilization = claims.filter(item => item.BufferUtilization !== undefined && parseFloat(item.BufferUtilization) > 0);
    const claimsWithCriticalIllness = claims.filter(item => item.CriticalIllness !== undefined && parseFloat(item.CriticalIllness) > 0);


    const totalAmountWithRoomRent = claimsWithRoomRent.reduce((total, claim) => {
      const copayValue = parseFloat(claim.RoomRent);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);
    // console.log("claims with roomrent", claimsWithRoomRent.length)

    const roomRent_claims = claimsWithRoomRent.length
    // console.log("Total amount with roomrent:", totalAmountWithRoomRent);

    const totalAmountWithMetarnity = claimsWithMaternity.reduce((total, claim) => {
      const copayValue = parseFloat(claim.Maternity);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);
    // console.log("claims with maternity", claimsWithMaternity.length)
    // console.log("Total amount with metarnity:", totalAmountWithMetarnity);
    const maternity_claims = claimsWithMaternity.length
    const buffer_claims = claimsWithBufferUtilization.length
    const critical_claims = claimsWithCriticalIllness.length


    const totalAmountWithBufferUtilization = claimsWithBufferUtilization.reduce((total, claim) => {
      const copayValue = parseFloat(claim.BufferUtilization);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);
    // console.log("claims with buffer utilization", claimsWithBufferUtilization.length)
    // console.log("Total amount with BufferUtilization:", totalAmountWithBufferUtilization);



    const totalAmountWithCriticalIllness = claimsWithCriticalIllness.reduce((total, claim) => {
      const copayValue = parseFloat(claim.CriticalIllness);
      return isNaN(copayValue) ? total : total + copayValue;
    }, 0);
    // console.log("claims with critical illness", claimsWithCriticalIllness.length)
    // console.log("Total amount with criticalillness:", totalAmountWithCriticalIllness);

    const demographicClaims = claims.filter((item) => item.ProviderCity)
      .map(item => item.ProviderCity.toLowerCase());
    const uniqueCities = [...new Set(demographicClaims)];
    const uniqueCities1 = uniqueCities.map(city => city.charAt(0).toUpperCase() + city.slice(1));

    // console.log("Total cities:", demographicClaims.length);
    // console.log("Unique cities:", uniqueCities1.length);

    const cityAmounts = {};
    let totalcitiesClaimedAmount = 0;
    let totalcitiesIncurredAmount = 0;

    claims.forEach(claim => {
      const cityName = claim.ProviderCity.toLowerCase();
      const claimedAmount = parseFloat(claim.ClaimedAmount);
      const incurredAmount = parseFloat(claim.IncurredAmount);
      totalcitiesClaimedAmount += claimedAmount
      totalcitiesIncurredAmount += incurredAmount

      if (cityName in cityAmounts) {
        cityAmounts[cityName].claimed += claimedAmount;
        cityAmounts[cityName].incurred += incurredAmount;
      } else {
        cityAmounts[cityName] = {
          claimed: claimedAmount,
          incurred: incurredAmount
        };
      }
    });


    const cityAmountsArray = Object.entries(cityAmounts).map(([city, amounts]) => ({
      city: city,
      claimed: amounts.claimed,
      incurred: amounts.incurred
    }));


    const sortedCitiesByClaimed = cityAmountsArray.sort((a, b) => b.incurred - a.incurred);


    const top15CitiesByClaimed = sortedCitiesByClaimed.slice(0, 10);

    // console.log("Top 15 cities by claimed amount:", top15CitiesByClaimed);

    return {
      top15CitiesByClaimed, roomRent_claims, totalAmountWithRoomRent,
      totalAmountWithBufferUtilization,
      totalAmountWithCriticalIllness,
      totalAmountWithMetarnity,
      maternity_claims,
      buffer_claims,
      critical_claims,
      totalcitiesClaimedAmount,
      totalcitiesIncurredAmount
    }
    // res
    //   .status(200)
    //   .json({ msg: "Claims fetched successfully",top15CitiesByClaimed });
  } catch (error) {

    return res.status(500).json({ msg: "Failed to fetch claims" });
  }
};



async function getProviderClaimAnalysis(tenantID) {


  try {
    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();





    const ProviderNameClaims = claims.filter((item) => item.ProviderHospitalName)
      .map(item => item.ProviderHospitalName.toLowerCase());
    const uniqueHospitals = [...new Set(ProviderNameClaims)];
    const uniqueHospitals1 = uniqueHospitals.map(name => name.charAt(0).toUpperCase() + name.slice(1));

    // console.log("Total hospitals:", ProviderNameClaims.length);
    // console.log("Unique hospitals:", uniqueHospitals1.length);

    const hospitalData = {};
    let totalClaimedAmount = 0;
    let totalIncurredAmount = 0;

    claims.forEach(claim => {
      const hospitalName = claim.ProviderHospitalName.toLowerCase();
      const claimedAmount = parseFloat(claim.ClaimedAmount);
      const incurredAmount = parseFloat(claim.IncurredAmount);
      totalClaimedAmount += claimedAmount;
      totalIncurredAmount += incurredAmount;

      if (hospitalName in hospitalData) {
        hospitalData[hospitalName].claimed += claimedAmount;
        hospitalData[hospitalName].incurred += incurredAmount;
        hospitalData[hospitalName].numClaims += 1
      } else {
        hospitalData[hospitalName] = {
          claimed: claimedAmount,
          incurred: incurredAmount,
          numClaims: 1,

        };
      }
    });


    const hospitalDataArray = Object.entries(hospitalData).map(([hospital, data]) => ({
      hospital: hospital,
      claimed: data.claimed,
      incurred: data.incurred,
      numClaims: data.numClaims

    }));


    const sortedProvidersByClaimed = hospitalDataArray.sort((a, b) => b.incurred - a.incurred);


    const top15ProvidersByClaimed = sortedProvidersByClaimed.slice(0, 10);

    // console.log("Top 15 hospitals by claimed amount:", top15ProvidersByClaimed);

    return { top15ProvidersByClaimed, totalIncurredAmount, totalClaimedAmount }
    // res
    //   .status(200)
    //   .json({ msg: "Claims fetched successfully",top15ProvidersByClaimed });

  } catch (error) {
    console.log(error);
  }
}




async function getAilmentClaimAnalysis(tenantID) {


  try {
    const ClaimsData = await getClaimDataModel(tenantID);
    const claims = await ClaimsData.find();
    const DiseaseNameClaims = claims.filter((item) => item.DiseaseCategory)
      .map(item => item.DiseaseCategory.toLowerCase());
    const uniquedisease = [...new Set(DiseaseNameClaims)];
    const uniquedisease1 = uniquedisease.map(name => name.charAt(0).toUpperCase() + name.slice(1));


    const diseaseData = {};
    let totalDiseaseClaimedAmount = 0;
    let totalDiseaseIncurredAmount = 0;
    let grandTotalClaims = 0;

    claims.forEach(claim => {
      const diseaseName = claim.DiseaseCategory.toLowerCase();
      const claimedAmount = parseFloat(claim.ClaimedAmount);
      const incurredAmount = parseFloat(claim.IncurredAmount);
      const numClaims = 1
      totalDiseaseClaimedAmount += claimedAmount;
      totalDiseaseIncurredAmount += incurredAmount;
      grandTotalClaims += numClaims

      if (diseaseName in diseaseData) {
        diseaseData[diseaseName].claimed += claimedAmount;
        diseaseData[diseaseName].incurred += incurredAmount;
        diseaseData[diseaseName].numClaims += numClaims
      } else {
        diseaseData[diseaseName] = {
          claimed: claimedAmount,
          incurred: incurredAmount,
          numClaims: 1,

        };
      }
    });


    const diseaseDataArray = Object.entries(diseaseData).map(([disease, data]) => ({
      disease: disease,
      claimed: data.claimed,
      incurred: data.incurred,
      numClaims: data.numClaims

    }));


    const sortedAilmentByClaimed = diseaseDataArray.sort((a, b) => b.incurred - a.incurred);


    const top15AilmentsByClaimed = sortedAilmentByClaimed.slice(0, 15);

    // console.log("Top 15 hospitals by claimed amount:", top15AilmentsByClaimed);

    return { top15AilmentsByClaimed, totalDiseaseClaimedAmount, totalDiseaseIncurredAmount, grandTotalClaims }
    // res
    //   .status(200)
    //   .json({ msg: "Claims fetched successfully",top15ProvidersByClaimed });

  } catch (error) {
    console.log(error);
  }
}


//member analysis


async function getMembersDataAnalysis(tenantID) {

  // const tenantID = req.params.tenantID
  try {
    const MembersData = await getMemberDataModel(tenantID)
    const members = await MembersData.find()
    // console.log(members.length)

    //gender analysis
    const male = await members?.filter((item) => item?.Gender == 'Male' || item?.Gender == 'MALE')
    const maleCount = male.length
    // console.log(maleCount)


    const female = await members?.filter(item => item?.Gender == 'Female' || item?.Gender == 'FEMALE')
    const femaleCount = female.length
    // console.log(femaleCount)


    const totalGenderCount = femaleCount + male.length

    //relationShip
    const child = await members?.filter((item) => item?.Relationship === 'child' || item?.Relationship === 'Child')
    const childCount = child.length

    // console.log(childCount)


    const employee = await members?.filter((item) => item?.Relationship === 'Employee' || item?.Relationship === 'employee')
    const employeeCount = employee.length

    // console.log(employeeCount)


    const parent = await members?.filter((item) => item?.Relationship === 'parent' || item?.Relationship === 'Parent')
    const parentCount = parent.length

    // console.log(parentCount)

    const parent_in_law = await members?.filter((item) => item?.Relationship === 'parent-in-law')
    const parent_in_lawCount = parent_in_law.length

    // console.log(parent_in_lawCount)


    const spouse = await members?.filter((item) => item?.Relationship === 'Spouse' || item?.Relationship === 'spouse')
    const spouseCount = spouse.length

    // console.log(spouseCount)


    const totalRelationshipCount = childCount + employeeCount + parentCount + parent_in_lawCount + spouseCount

    //grades
    const garde_I = await members?.filter((item) => item?.Grade === 'I' || item?.Relationship === 'i')
    const garde_ICount = garde_I.length

    // console.log(garde_ICount)



    const grade_II = await members?.filter((item) => item?.Grade === 'II' || item?.Relationship.toLowerCase() === 'ii');
    const grade_IICount = grade_II.length;
    // console.log("Grade II count:", grade_IICount);


    const grade_III = await members?.filter((item) => item?.Grade === 'III' || item?.Relationship.toLowerCase() === 'iii');
    const grade_IIICount = grade_III.length;
    // console.log(grade_IIICount);


    const grade_IV = await members?.filter((item) => item?.Grade === 'IV' || item?.Relationship.toLowerCase() === 'iv');
    const grade_IVCount = grade_IV.length;
    // console.log(grade_IVCount);


    const grade_V = await members?.filter((item) => item?.Grade === 'V' || item?.Relationship.toLowerCase() === 'v');
    const grade_VCount = grade_V.length;
    // console.log(grade_VCount);


    const grade_VI = await members?.filter((item) => item?.Grade === 'VI' || item?.Relationship.toLowerCase() === 'vi');
    const grade_VICount = grade_VI.length;
    // console.log(grade_VICount);

    const totalGradeCount = garde_ICount + grade_IICount + grade_IIICount + grade_IVCount + grade_VCount + grade_VICount

    //insured 


    const insuredData = {};

    members.forEach((member) => {
      const currentSumInsured = member.CurrentSumInsured;
      const proposedSumInsured = member.NewOrProposedSumInsured;

      const key = `${currentSumInsured}_${proposedSumInsured}`;

      if (key in insuredData) {
        insuredData[key].numClaims++;
      } else {
        insuredData[key] = {
          currentInsured: parseInt(currentSumInsured),
          proposedInsured: parseInt(proposedSumInsured),
          numClaims: 1,
        };
      }
    });

    const insuredDataArray = Object.values(insuredData).map((item) => ({
      currentInsured: item.currentInsured,
      proposedInsured: item.proposedInsured,
      numClaims: item.numClaims,
    }));
    insuredDataArray.sort((a, b) => a.proposedInsured - b.proposedInsured);
    // console.log(insuredDataArray);


    let grandTotalCurrentInsured = 0;
    let grandTotalProposedInsured = 0;
    let grandTotalInsuredClaims = insuredDataArray.reduce((total, item) => total + item.numClaims, 0);


    insuredDataArray.forEach((item) => {
      // grandTotalCurrentInsured += item.currentInsured;
      if (Array.isArray(item.proposedInsured)) {
        grandTotalProposedInsured += item.proposedInsured.reduce((acc, val) => acc + val, 0);

      } else {
        grandTotalProposedInsured += item.proposedInsured;
      }
    });




    //group by age range

    // const calculateAge = (dateOfBirth) => {
    //   const dob = new Date(dateOfBirth);
    //   const today = new Date();
    //   let age = today.getFullYear() - dob.getFullYear();
    //   const monthDiff = today.getMonth() - dob.getMonth();
    //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    //     age--;
    //   }
    //   return age;
    // };

    const calculateAge = (dateOfBirth) => {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      // Ensure age is non-negative
      return Math.max(age, 0);
    };


    const groupByAgeRange = (age) => {
      if (age < 0) {
        return '< 0';
      } else if (age >= 0 && age <= 18) {
        return '0 - 18';
      } else if (age > 18 && age <= 35) {
        return '19 - 35';
      } else if (age > 35 && age <= 45) {
        return '36 - 45';
      } else if (age > 45 && age <= 55) {
        return '46 - 55';
      } else if (age > 55 && age <= 65) {
        return '56 - 65';
      } else if (age > 65 && age <= 70) {
        return '66 - 70';
      } else if (age > 70 && age <= 75) {
        return '71 - 75';
      } else if (age > 75 && age <= 80) {
        return '76 - 80';
      } else {
        return 'Above 80';
      }
    };


    const ageGroupClaims = {};


    members.forEach((member) => {
      const age = calculateAge(member.DateOfBirth);
      const ageRange = groupByAgeRange(age);
      const proposedSumInsured = member.NewOrProposedSumInsured.replace(/,/g, ''); // Remove commas

      if (!(proposedSumInsured in ageGroupClaims)) {
        ageGroupClaims[proposedSumInsured] = {};
      }

      if (ageRange in ageGroupClaims[proposedSumInsured]) {
        ageGroupClaims[proposedSumInsured][ageRange]++;
      } else {
        ageGroupClaims[proposedSumInsured][ageRange] = 1;
      }
    });

    Object.keys(ageGroupClaims).forEach((proposedSumInsured) => {
      let grandTotal = 0;
      Object.values(ageGroupClaims[proposedSumInsured]).forEach((count) => {
        grandTotal += count;
      });
      ageGroupClaims[proposedSumInsured]['Grand Total'] = grandTotal;
      // console.log("111111111", ageGroupClaims[proposedSumInsured]['Grand Total'] = grandTotal)
    });

    // console.log(ageGroupClaims);





    return {
      // res.status(200).json({msg:"Members data fetched successfully",
      maleCount,
      femaleCount,
      totalGenderCount,
      childCount,
      employeeCount,
      parentCount,
      parent_in_lawCount,
      spouseCount,
      totalRelationshipCount,
      garde_ICount,
      grade_IICount,
      grade_IIICount,
      grade_IVCount,
      grade_VCount,
      grade_VICount,
      totalGradeCount,
      insuredDataArray,
      grandTotalCurrentInsured,
      grandTotalProposedInsured,
      grandTotalInsuredClaims,
      ageGroupClaims
    }


  } catch (error) {
    // console.log(error)

    return res.status(500).json({ msg: "Failed to fetch members" });
  }
}






async function getRFQAnalysis(tenantID) {

  // tenantID = req.params.tenantID;


  try {
    const RFQData = await getRFQModel(tenantID);
    const rfq = await RFQData.find()
    // .sort({createdAt:-1}).lean();

    // console.log(rfq)

    //cliams and incurred claims from rfq directly

    const no_of_claims = await rfq[0]?.policy_summary?.claims?.numberOfClaims
    // console.log("no_of_claims", no_of_claims);


    const total_incurred_claims = await rfq[0]?.policy_summary?.claims?.totalIncurred
    // console.log("no_of_claims", total_incurred_claims);


    //inception premiums directly from rfq

    const inception_premiums = await rfq[0]?.policy_summary?.premiums?.inception
    const total_premiums = await rfq[0]?.policy_summary?.premiums?.finalAtClaimsDate
    const inception_members = await rfq[0]?.members_summary?.employees?.inception?.lives

    const inception_per_life_rate1 = inception_premiums / inception_members
    const inception_per_life_rate2 = inception_per_life_rate1.toFixed(0)



    const members_at_end = await rfq[0]?.members_summary?.employees?.renewal?.lives

    const assumed_past_exposure_sum = parseInt(inception_members) + parseInt(members_at_end)
    const assumed_past_exposure_average = assumed_past_exposure_sum / 2
    const assumed_past_exposure = assumed_past_exposure_average
    // console.log(assumed_past_exposure)

    const cliam_incident_rate = (no_of_claims / assumed_past_exposure * 100).toFixed(2)
    // console.log(cliam_incident_rate)

    const claims_average = Math.round(total_incurred_claims / no_of_claims)
    // console.log(claims_average)

    const total_policy_days = await rfq[0]?.policy_summary?.total_Policy_Days
    const policy_left_days = await rfq[0]?.policy_summary?.policy_Left_Days

    //....need to check 
    const anualization_factor = ((policy_left_days / total_policy_days) * 100).toFixed(4);
    // console.log("anualization_factor:", anualization_factor);

    const anualization_factor1 = parseFloat(anualization_factor) / 100;
    // console.log("anualization_factor1:", anualization_factor1);

    const annualised_claims = Math.round(((total_incurred_claims / (1 - anualization_factor1))).toFixed(2));
    // console.log(1 - anualization_factor1)
    // console.log("annualised_claims: ", annualised_claims);
    const IBNR_percentage = 2.00;
    const claims_inflation_percentage = 4.00;
    const TPA_percentage = 2.5;
    const expenses_percentage = 2.5;
    const brokerage_percentage = 7.50;
    const margin_percentage = 5.0;





    const IBNR = Math.round(annualised_claims * IBNR_percentage / 100)
    // console.log(IBNR)

    const Expected_Ultimate = annualised_claims + IBNR
    // console.log(Expected_Ultimate)
    const Ultimate_Loss_Ratio = (Expected_Ultimate / total_premiums) * 100
    // console.log(Ultimate_Loss_Ratio.toFixed(1))
    let Expected_Claims_with_Inflation;
    let Cost_per_life;
    let Risk_Premium_based_on_burn;
    let Gross_Premium_without_Brokerage;
    let Gross_Premium_with_Brokerage;
    let Obtained_Loss_ratio;
    let Estimated_Per_Life_Rate




    if (Ultimate_Loss_Ratio >= 70) {
      // console.log("iam > 70")

      Expected_Claims_with_Inflation = Math.round(Expected_Ultimate * (1 + claims_inflation_percentage / 100))
      Cost_per_life = Expected_Claims_with_Inflation / assumed_past_exposure
      Risk_Premium_based_on_burn = Cost_per_life * members_at_end
      Gross_Premium_without_Brokerage = Risk_Premium_based_on_burn / (1 - (TPA_percentage / 100 + expenses_percentage / 100 + margin_percentage / 100))
      Gross_Premium_with_Brokerage = Gross_Premium_without_Brokerage * (1 + brokerage_percentage / 100)
      Obtained_Loss_ratio = (Risk_Premium_based_on_burn / Gross_Premium_without_Brokerage) * 100
      Estimated_Per_Life_Rate = Math.ceil(Gross_Premium_without_Brokerage / members_at_end)

    } else {
      // console.log("iam < 70")
    }
    // console.log(Expected_Claims_with_Inflation)
    // console.log(Cost_per_life)
    // console.log(Risk_Premium_based_on_burn)


    const a = parseFloat(Gross_Premium_without_Brokerage?.toFixed(2)) ? parseFloat(Gross_Premium_without_Brokerage.toFixed(2)) : null

    // console.log(a);

    const roundedValue = Math.ceil(a);
    // console.log(roundedValue);

    // console.log(Gross_Premium_with_Brokerage)
    // console.log(Obtained_Loss_ratio)
    // console.log(Estimated_Per_Life_Rate)




    return {
      //  res.status(200)
      //   .json({ msg: "rfq fetched successfully",
      rfq,
      no_of_claims,
      total_incurred_claims,
      inception_premiums,
      total_premiums,
      inception_members,
      inception_per_life_rate2,
      total_premiums,
      inception_premiums,
      members_at_end,
      assumed_past_exposure,
      cliam_incident_rate,
      claims_average,
      anualization_factor,
      annualised_claims,
      Expected_Ultimate,
      Ultimate_Loss_Ratio,
      Expected_Claims_with_Inflation,
      Cost_per_life,
      Risk_Premium_based_on_burn,
      Gross_Premium_without_Brokerage,
      Gross_Premium_with_Brokerage,
      Obtained_Loss_ratio,
      Estimated_Per_Life_Rate
    };




  } catch (error) {
    console.log(error);
  }
}



async function getSomeInfoFromRJACApplication() {


  try {

    const responses = await Promise.all(
      [


        await axios.get('https://oyster-app-f6s5e.ondigitalocean.app/api/gratuityprojects'),
        await axios.get('https://oyster-app-f6s5e.ondigitalocean.app/api/leaveValuation'),

        // await axios.get('http://localhost:8000/api/gratuityprojects'),
        // await axios.get('http://localhost:8000/api/leaveValuationTC'),




      ]
    )


    const [grad, leaveData] = responses


    const gradData = grad.data
    const leaveinfo = leaveData.data



    return {

      gradData,
      leaveinfo
    }
  } catch (error) {
    console.log(error);
    throw error
  }
}



async function getSomeInfo(tenantID) {


  // console.log(tenantID)
  try {
    const { gradData, leaveinfo } = await getSomeInfoFromRJACApplication()




    const leaveInfo = await leaveinfo?.filter(item => item?.client?.totalConnect_id == tenantID)
    // console.log("2099", leaveInfo)

    const gradinfo = await gradData.find(item => item?.client?.totalConnect_id == tenantID)

    const totalEmployee = gradinfo?.employee_data?.summary?.total_employee || 0
    const totalYearlySalary = gradinfo?.employee_data?.summary?.toatal_monthly_salary || 0
    const averageAge = gradinfo?.employee_data?.summary?.avrage_age || 0
    const averagePastService = gradinfo?.employee_data?.summary?.avrage_past_service || 0
    const averageEntryAge = gradinfo?.employee_data?.summary?.avrage_entry_age || 0
    const aggregratetotalDbo = gradinfo?.employee_data?.aggregrate.totalDBO || 0
    const aggregrateyear1 = gradinfo?.employee_data?.aggregrate?.totalYear1 || 0
    const aggregrateyear2 = gradinfo?.employee_data?.aggregrate?.totalYear2 || 0

    const aggregrateyear3 = gradinfo?.employee_data?.aggregrate?.totalYear3 || 0

    const aggregrateyear4 = gradinfo?.employee_data?.aggregrate?.totalYear4 || 0

    const aggregrateyear5 = gradinfo?.employee_data?.aggregrate?.totalYear5 || 0

    const aggregrateyear6 = gradinfo?.employee_data?.aggregrate?.totalYear6 || 0
    const totalgraduity = parseFloat(aggregrateyear1
      + aggregrateyear2 + aggregrateyear3 + aggregrateyear4 + aggregrateyear5 + aggregrateyear6
    )


    const salaryesca1st3years = gradinfo?.salary_escalation?.first3years || 0
    const salaryescafter3years = gradinfo?.salary_escalation?.after3years || 0

    const fixedAttrition = gradinfo?.attrition?.fixed_withdrawal_rat || 0
    const terminationAttrition = gradinfo?.attrition?.termination_weightage || 0
    const resignationAttrition = gradinfo?.attrition?.resignation_weightage || 0
    const withdrawrateone = gradinfo?.employee_data?.sensitivity_analysis?.withdrawalRatwPlus1 || 0


    const leaves = {}
    leaveInfo.forEach(leave => {
      const leaveType = leave.leave_type
      const amount = leave.aggregrate.totalDBO
      const futureAmount =
        parseFloat(leave.aggregrate.totalYear1) +
        parseFloat(leave.aggregrate.totalYear2) +
        parseFloat(leave.aggregrate.totalYear3) +
        parseFloat(leave.aggregrate.totalYear4) +
        parseFloat(leave.aggregrate.totalYear5) +
        parseFloat(leave.aggregrate.totalYear6);


      if (leaveType in leaves) {
        leaves[leaveType].currentamount += amount
        leaves[leaveType].futureamount += futureAmount

      } else {
        leaves[leaveType] = {
          currentamount: amount,
          futureamount: futureAmount
        }
      }
    })

    const leavesArray = Object.entries(leaves).map(([leave, data]) => ({
      typeOfLeave: leave,
      CurrentAmount: data.currentamount,
      FutureAmount: data.futureamount

    }))

    // console.log("2128", leavesArray)




    if (gradinfo) {
      return {
        totalEmployee,
        totalYearlySalary,
        averageAge,
        averagePastService,
        averageEntryAge,
        aggregratetotalDbo,
        aggregrateyear1,
        aggregrateyear2,
        aggregrateyear3,
        aggregrateyear4,
        aggregrateyear5,
        aggregrateyear6,
        salaryesca1st3years,
        salaryescafter3years,
        fixedAttrition,
        terminationAttrition,
        resignationAttrition,
        withdrawrateone,
        leavesArray,
        totalgraduity

      }
    } else {
      // console.log("No info found with ID:", tenantID);
      return ("No info found with ID:", tenantID)

    }


  } catch (error) {
    // console.log(error)
    throw error

  }
}

async function getEmployee(tenantID) {

  try {
    const EmployeeData = await getEmployeeModel(tenantID)

    const Employee = await EmployeeData.find()

    const employeeDepartment = {}
    let employeeDepartmentSalary = 0
    const employeePosition = {}
    let employeePositionSalary = 0


    Employee.forEach(emp => {
      const departmentName = emp.department;
      const positionName = emp.position;
      const salary = parseFloat(emp?.currentSalary);


      if (!(departmentName in employeeDepartment)) {
        employeeDepartment[departmentName] = {
          noOfemp: 0,
          employeesSalary: 0,
          positions: {}
        };
      }


      employeeDepartment[departmentName].noOfemp++;
      employeeDepartment[departmentName].employeesSalary += salary;


      if (!(positionName in employeeDepartment[departmentName].positions)) {
        employeeDepartment[departmentName].positions[positionName] = {
          noOfEmp: 1,
          employeesSalary: salary
        };
      } else {
        employeeDepartment[departmentName].positions[positionName].noOfEmp++;
        employeeDepartment[departmentName].positions[positionName].employeesSalary += salary;
      }
    });


    const employeeDepartmentArray = Object.entries(employeeDepartment).map(([departmentName, data]) => ({
      departmentName: departmentName,
      numberEmp: data.noOfemp,
      totalSalary: data.employeesSalary,
      averageSalary: parseFloat(data.employeesSalary / data.noOfemp),
      positions: Object.entries(data.positions).map(([positionName, positionData]) => ({
        positionName: positionName,
        numberEmp: positionData.noOfEmp,
        totalSalary: positionData.employeesSalary,
        averageSalary: parseFloat(positionData.employeesSalary / positionData.noOfEmp)
      }))
    }));


    const grandTotalCount = employeeDepartmentArray.reduce((total, { numberEmp }) => total + numberEmp, 0);






    //position
    Employee.forEach(emp => {
      const positionName = emp.position
      const salary = parseFloat(emp?.currentSalary)
      const numEmp = 1
      if (positionName in employeePosition) {
        employeePosition[positionName].noOfEmp += numEmp
        employeePosition[positionName].employeesSalary += salary
      } else {
        employeePosition[positionName] = {
          noOfEmp: numEmp,
          employeesSalary: salary
        }
      }

    })
    const employeePositionArray = Object?.entries(employeePosition)?.map(([positionName, data]) => ({
      positionName: positionName,
      numberEmp: data.noOfEmp,
      totalSalary: data.employeesSalary,
      averageSalary: parseFloat(data.employeesSalary / data.noOfEmp)

    }))
    // console.log(employeePositionArray)
    const grandTotalPositionCount = employeePositionArray?.reduce((total, { numberEmp }) => total + numberEmp, 0);

    // console.log("Grand Total:", grandTotalPositionCount);

    return {
      employeeDepartmentArray,

      grandTotalCount,
      employeePositionArray,
      grandTotalPositionCount
    }

  } catch (error) {
    // console.log(error)
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function getPositionSalaryRange(tenantID) {
  try {
    const EmployeeData = await getEmployeeModel(tenantID)

    const Employee = await EmployeeData.find()
    const positionSalaryRange = {};


    Employee.forEach(emp => {
      const position = emp?.position;
      const salary = parseFloat(emp?.currentSalary);

      if (position in positionSalaryRange) {

        positionSalaryRange[position].minSalary = Math.min(positionSalaryRange[position].minSalary, salary);
        positionSalaryRange[position].maxSalary = Math.max(positionSalaryRange[position].maxSalary, salary);
      } else {

        positionSalaryRange[position] = {
          minSalary: salary,
          maxSalary: salary
        };
      }
    });


    const positionSalaryRangeArray = Object.entries(positionSalaryRange).map(([position, range]) => ({
      position: position,
      minSalary: range.minSalary,
      maxSalary: range.maxSalary
    }));

    return { positionSalaryRangeArray };
  }
  catch (error) {
    // console.log(error)
    throw error
  }
}






async function calculateEachemployeeAge(tenantID) {
  try {
      const EmployeeData = await getEmployeeModel(tenantID);
      const employees = await EmployeeData.find();

      const employeeAges = employees.map(emp => {
          const employeeCode = emp?.employeeCode;
          const employeeOfficeLocation = emp?.officeLocation;
          const gender = emp?.gender
          const dob = parseDate(emp?.dateofBirth);
          const doj = parseDate(emp?.dateofJoining)
          const age = calculateAge(dob);
          const pastService = calculatePastService(doj)

          return {
              employeeCode,
              gender,
              employeeOfficeLocation,
              age,
              pastService
          };
      });

      return { employeeAges };
  } catch (error) {
      // console.log(error);
      throw error;
  }
}

// Helper function to parse date string in "MM/DD/YYYY" format
function parseDate(dateString) {
  const [month, day, year] = dateString.split('/');
  return new Date(year, month - 1, day);
}

// Helper function to calculate age from date of birth
function calculateAge(dob) {
  const now = new Date();
  const ageDiffMs = now - dob;
  const ageDate = new Date(ageDiffMs);

  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Helper function to calculate past service in years from date of joining
function calculatePastService(doj) {
  const now = new Date();
  const pastServiceMs = now - doj;
  const pastServiceYears = pastServiceMs / (1000 * 60 * 60 * 24 * 365.25); // Including leap year consideration

  return Math.floor(pastServiceYears);
}










