const xlsx = require("xlsx");
const fs = require("fs");
const getClaimDataModelUAE = require("../model/claimsDataUAE");
const getAnalysisModelUAE = require("../model/analysisDataUAE");
const getMeberDataModel = require("../model/membersDataUAE")
const getEmployeeUAEModel = require("../model/employeeUAE");
const getRFQModel = require("../model/rfqUAE");


const axios = require("axios");



exports.uploadCliamDataUAE = async (req, res) => {
    try {
        const tenantID = req.params.tenantID;
        const ClaimsData = await getClaimDataModelUAE(tenantID);

        // Check if the uploaded file is valid
        if (req.error || !req.file?.filename) {
            return res.status(400).json({ msg: "Invalid or missing file. Please upload an Excel file." });
        }

        // Read the uploaded Excel file
        const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = xlsx.utils.decode_range(sheet["!ref"]);
        const extractedData = [];
        const messages = [];

        // Define column mappings
        const columns = {
            policyNumber: 0,
            groupNamepolicyholderName: 1,
            policyStartDate: 2,
            policyEndDate: 3,
            employeeMemberNo: 4,
            employeeName: 5,
            beneficiaryMemberNo: 6,
            beneficiaryName: 7,
            relationship: 8,
            annualLimit: 9,
            beneficiaryGender: 10,
            beneficiaryDateOfBirth: 11,
            beneficieryNationality: 12,
            regulatory: 13,
            networkclassification: 14,
            category: 15,
            claimNumber: 16,
            claimSource: 17,
            ip_op: 18,
            treatmentAdmissionDate: 19,
            dischargeDate: 20,
            claimReceivedDate: 21,
            settledDate: 22,
            claimType: 23,
            claimStatus: 24,
            paymentSatus: 25,
            claimedRequested: 26,
            Copay_DeductibleAmount: 27,
            rejectedAmount: 28,
            settled_FinalAmount: 29,
            primaryICDcode: 30,
            primaryICDdescription: 31,
            secondaryICDcode: 32,
            secondaryICDdescription: 33,
            servicetype: 34,
            serviceCode: 35,
            diagnosisType: 36,
            providerGroup: 37,
            providerName: 38,
            providerType: 39,
            providerCity: 40,
            resubmissionFlag: 41,
        };

        // Extract data from each row
        for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
            const rowData = {};
            for (const [key, col] of Object.entries(columns)) {
                rowData[key] = sheet[xlsx.utils.encode_cell({ r: rowNum, c: col })]?.w || "";
            }
            rowData.tenantId = tenantID;
            extractedData.push(rowData);
        }

        const dbdata = await ClaimsData.find(); // Get existing claims in the DB

        // Process the extracted data
        for (let eachClaim of extractedData) {
            const existingClaim = dbdata.find(claim => claim.claimNumber === eachClaim.claimNumber);

            if (existingClaim) {
                await ClaimsData.updateOne({ claimNumber: eachClaim.claimNumber }, eachClaim);
                messages.push(`Claim ${eachClaim.claimNumber} updated`);
            } else {
                const newClaim = new ClaimsData(eachClaim);
                await newClaim.save();
                messages.push(`Claim ${eachClaim.claimNumber} added`);
            }
        }

        // Identify and delete claims in the DB that are not in the uploaded file
        const claimNumbersInFile = extractedData.map(claim => claim.claimNumber);
        const claimsToDelete = dbdata.filter(claim => !claimNumbersInFile.includes(claim.claimNumber));

        for (const claim of claimsToDelete) {
            await ClaimsData.deleteOne({ claimNumber: claim.claimNumber });
            // console.log(`Deleted claim: ${claim.claimNumber}`);
        }

        // Remove the uploaded file
        fs.unlinkSync(`./uploads/${req.file.filename}`);

        res.status(200).json({ msg: "Excel uploaded and processed successfully", messages });
    } catch (error) {
        // console.error("Error during upload and processing: ", error);
        res.status(500).json({ error: error.message });
    }
};

exports.calculateClaimsDataUAE = async (req, res) => {
    const tenantID = req.params.tenantID;
    try {
        const ClaimsDataModel = await getClaimDataModelUAE(tenantID);
        const claims = await ClaimsDataModel.find();

        const totalClaimAmount = claims
            .filter(claim => claim.resubmissionFlag === "NO")
            .reduce((total, claim) => {
                const claimedAmount = parseFloat(claim.claimedRequested.replace(/,/g, ""));
                return total + claimedAmount;
            }, 0);

        const totalClaims = claims.filter(claim => claim.resubmissionFlag === "NO").length;


        //IPD paid claim calculations
        const ipdPaidClaim = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.resubmissionFlag === "NO" && item.ip_op === "IPD" && item.paymentSatus === "PAID CLAIM")
        const totalipdPaidClaimAmount = ipdPaidClaim.reduce((total, claim) => {
            return total + parseFloat(claim.claimedRequested.replace(/,/g, ""));
        }, 0)


        const totalipdPaidClaimAmountlength = ipdPaidClaim?.length;

        // Calculate the percentage of IPD paid claims
        const providerClaimsPercentageIPDpaid = ((totalipdPaidClaimAmountlength / totalClaims) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsPercentageIPDpaidDisplay = providerClaimsPercentageIPDpaid + "%";



        // Calculate the percentage of IPD paid claimsAmount
        const providerClaimsAmountPercentageIPDpaid = ((totalipdPaidClaimAmount / totalClaimAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsAmountPercentageIPDpaidDisplay = providerClaimsAmountPercentageIPDpaid + "%";


        //IPD Unpaid claim calculations
        const ipdUnPaidClaim = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.resubmissionFlag === "NO" && item.ip_op === "IPD" && item.paymentSatus === "UNPAID CLAIM")
        const totalipdUnPaidClaimAmount = ipdUnPaidClaim.reduce((total, claim) => {
            return total + parseFloat(claim.claimedRequested.replace(/,/g, ""));
        }, 0)


        const totalipdUnPaidClaimAmountlength = ipdUnPaidClaim?.length;

        // Calculate the percentage of IPD paid claims
        const providerClaimsPercentageIPDUnpaid = ((totalipdUnPaidClaimAmountlength / totalClaims) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsPercentageIPDUnpaidDisplay = providerClaimsPercentageIPDUnpaid + "%";



        // Calculate the percentage of IPD paid claims Amount
        const providerClaimsAmountPercentageIPDUnpaid = ((totalipdUnPaidClaimAmount / totalClaimAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsAmountPercentageIPDUnpaidDisplay = providerClaimsAmountPercentageIPDUnpaid + "%";




        //OPD paid claim calculations
        const opdPaidClaim = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.resubmissionFlag === "NO" && item.ip_op === "OPD" && item.paymentSatus === "PAID CLAIM")
        const totalopdPaidClaimAmount = opdPaidClaim.reduce((total, claim) => {
            return total + parseFloat(claim.claimedRequested.replace(/,/g, ""));
        }, 0)


        const totalopdPaidClaimAmountlength = opdPaidClaim?.length;
        // Calculate the percentage of OPD paid claims
        const providerClaimsPercentageOPDpaid = ((totalopdPaidClaimAmountlength / totalClaims) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsPercentageOPDpaidDisplay = providerClaimsPercentageOPDpaid + "%";



        // Calculate the percentage of OPD paid claims Amount
        const providerClaimsAmountPercentageOPDpaid = ((totalopdPaidClaimAmount / totalClaimAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsAmountPercentageOPDpaidDisplay = providerClaimsAmountPercentageOPDpaid + "%";



        //OPD Unpaid claim calculations
        const opdUnPaidClaim = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.resubmissionFlag === "NO" && item.ip_op === "OPD" && item.paymentSatus === "UNPAID CLAIM")
        const totalopdUnPaidClaimAmount = opdUnPaidClaim.reduce((total, claim) => {
            return total + parseFloat(claim.claimedRequested.replace(/,/g, ""));
        }, 0)


        const totalopdUnPaidClaimAmountlength = opdUnPaidClaim?.length;

        // Calculate the percentage of OPD paid claims
        const providerClaimsPercentageOPDUnpaid = ((totalopdUnPaidClaimAmountlength / totalClaims) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsPercentageOPDUnpaidDisplay = providerClaimsPercentageOPDUnpaid + "%";



        // Calculate the percentage of OPD paid claimsAmount
        const providerClaimsAmountPercentageOPDUnpaid = ((totalopdUnPaidClaimAmount / totalClaimAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerClaimsAmountPercentageOPDUnpaidDisplay = providerClaimsAmountPercentageOPDUnpaid + "%";



        //total providerClaimCount and total %
        const totalproviderClaimCount = totalipdPaidClaimAmountlength + totalipdUnPaidClaimAmountlength + totalopdPaidClaimAmountlength + totalopdUnPaidClaimAmountlength
        // Convert the percentage strings to numbers
        const providerClaimsPercentageIPDpaidNum = parseFloat(providerClaimsPercentageIPDpaidDisplay);
        const providerClaimsPercentageIPDUnpaidNum = parseFloat(providerClaimsPercentageIPDUnpaidDisplay);
        const providerClaimsPercentageOPDpaidNum = parseFloat(providerClaimsPercentageOPDpaidDisplay);
        const providerClaimsPercentageOPDUnpaidNum = parseFloat(providerClaimsPercentageOPDUnpaidDisplay);

        // Calculate the total provider claim count percentage
        const totalproviderClaimCountPercentage = providerClaimsPercentageIPDpaidNum + providerClaimsPercentageIPDUnpaidNum + providerClaimsPercentageOPDpaidNum + providerClaimsPercentageOPDUnpaidNum;

        // Format the result as a percentage string for display
        const totalproviderClaimCountPercentageDisplay = totalproviderClaimCountPercentage.toFixed(2) + "%";




        //total providerClaimCount and total %
        const totalproviderClaimAmount = totalipdPaidClaimAmount + totalipdUnPaidClaimAmount + totalopdPaidClaimAmount + totalopdUnPaidClaimAmount

        // Convert the percentage strings to numbers
        const providerClaimsAmountPercentageIPDpaidNum = parseFloat(providerClaimsAmountPercentageIPDpaidDisplay);
        const providerClaimsAmountPercentageIPDUnpaidNum = parseFloat(providerClaimsAmountPercentageIPDUnpaidDisplay);
        const providerClaimsAmountPercentageOPDpaidNum = parseFloat(providerClaimsAmountPercentageOPDpaidDisplay);
        const providerClaimsAmountPercentageOPDUnpaidNum = parseFloat(providerClaimsAmountPercentageOPDUnpaidDisplay);

        // Calculate the total provider claim count percentage
        const totalproviderClaimAmountPercentage = providerClaimsAmountPercentageIPDpaidNum + providerClaimsAmountPercentageIPDUnpaidNum + providerClaimsAmountPercentageOPDpaidNum + providerClaimsAmountPercentageOPDUnpaidNum;

        // Format the result as a percentage string for display
        const totalproviderClaimAmountPercentageDisplay = totalproviderClaimAmountPercentage.toFixed(2) + "%";






        //Final amount calculations starts from here
        const totalFinalAmount = claims.reduce((total, claim) => {
            const finalAmount = parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
            return total + finalAmount;
        }, 0);


        //IPD paid final amount calculations
        const ipdPaidFinal = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.ip_op === "IPD" && item.paymentSatus === "PAID CLAIM")
        const totalipdPaidFinalAmount = ipdPaidFinal.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)


        // Calculate the percentage of IPD paid finalAmount
        const providerFinalAmountPercentageIPDpaid = ((totalipdPaidFinalAmount / totalFinalAmount) * 100).toFixed(2);


        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerFinalAmountPercentageIPDpaidDisplay = providerFinalAmountPercentageIPDpaid + "%";



        //IPD Unpaid final calculations
        const ipdUnPaidFinal = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.ip_op === "IPD" && item.paymentSatus === "UNPAID CLAIM")
        const totalipdUnPaidFinalAmount = ipdUnPaidFinal.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)


        // Calculate the percentage of IPD paid finalAmount
        const providerFinalAmountPercentageIPDUnpaid = ((totalipdUnPaidFinalAmount / totalFinalAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerFinalAmountPercentageIPDUnpaidDisplay = providerFinalAmountPercentageIPDUnpaid + "%";




        //OPD paid final amount calculations
        const opdPaidFinal = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.ip_op === "OPD" && item.paymentSatus === "PAID CLAIM")
        const totalopdPaidFinalAmount = opdPaidFinal.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)

        // Calculate the percentage of oPD paid finalAmount
        const providerFinalAmountPercentageOPDpaid = ((totalopdPaidFinalAmount / totalFinalAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerFinalAmountPercentageOPDpaidDisplay = providerFinalAmountPercentageOPDpaid + "%";




        //OPD Unpaid final calculations
        const opdUnPaidFinal = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.ip_op === "OPD" && item.paymentSatus === "UNPAID CLAIM")
        const totalopdUnPaidFinalAmount = opdUnPaidFinal.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)


        // Calculate the percentage of IPD paid finalAmount
        const providerFinalAmountPercentageOPDUnpaid = ((totalopdUnPaidFinalAmount / totalFinalAmount) * 100).toFixed(2);



        // If you need to display it with a percentage sign somewhere else, you can format it there
        const providerFinalAmountPercentageOPDUnpaidDisplay = providerFinalAmountPercentageOPDUnpaid + "%";



        // Total final op ip amount

        const totalproviderFinalAmount = totalipdPaidFinalAmount + totalipdUnPaidFinalAmount + totalopdPaidFinalAmount + totalopdUnPaidFinalAmount



        // Convert the percentage strings to numbers
        const providerFinalAmountPercentageIPDpaidNum = parseFloat(providerFinalAmountPercentageIPDpaidDisplay);
        const providerFinalAmountPercentageIPDUnpaidNum = parseFloat(providerFinalAmountPercentageIPDUnpaidDisplay);
        const providerFinalAmountPercentageOPDpaidNum = parseFloat(providerFinalAmountPercentageOPDpaidDisplay);
        const providerFinalAmountPercentageOPDUnpaidNum = parseFloat(providerFinalAmountPercentageOPDUnpaidDisplay);

        // Calculate the total provider claim count percentage
        const totalproviderFinalAmountPercentage = providerFinalAmountPercentageIPDpaidNum + providerFinalAmountPercentageIPDUnpaidNum + providerFinalAmountPercentageOPDpaidNum + providerFinalAmountPercentageOPDUnpaidNum;

        // Format the result as a percentage string for display
        const totalproviderFinalAmountPercentageDisplay = totalproviderFinalAmountPercentage.toFixed(2) + "%";





        //Final amount calculation based on the claime status


      


        const claimStatusFinalApproved = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "APPROVED")
        const totalclaimStatusFinalApprovedAmount = claimStatusFinalApproved.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)


            const claimStatusFinalApprovedCount = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "APPROVED" && item.resubmissionFlag === "NO")
    
             const totalclaimStatusCountApprovedLength = claimStatusFinalApprovedCount?.length


        const claimStatusFinalRejected = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "REJECTED")
        const totalclaimStatusFinalRejectedAmount = claimStatusFinalRejected.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)

        const claimStatusFinalRejectedCount = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "REJECTED" && item.resubmissionFlag === "NO")

        const totalclaimStatusCountRejectedLength = claimStatusFinalRejectedCount?.length



        const claimStatusFinalPartially = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "PARTIALLY APPROVED")
        const totalclaimStatusFinalPartiallyAmount = claimStatusFinalPartially.reduce((total, claim) => {
            return total + parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        }, 0)

        const claimStatusFinalPartiallyCount = claims.filter((item) => item.claimType === "PROVIDER CLAIM" && item.claimStatus === "PARTIALLY APPROVED" && item.resubmissionFlag === "NO")
        const totalclaimStatusCountPartiallyLength = claimStatusFinalPartiallyCount?.length






        // Relations Calculation start from here

        //Daughter 
        const daugterRelationClaims = await claims?.filter((item) => item.relationship === "DAUGHTER" && item.resubmissionFlag === "NO")
        const daughterClaimsCount = daugterRelationClaims.length
        const daughterClaimsClaimedAmount = daugterRelationClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const daugterRelationFinal = await claims?.filter((item) => item.relationship === "DAUGHTER")
        const daughterFinalAmount = daugterRelationFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)


        //Female Employee without meternity

        const FemaleEmployeeMRelationClaims = await claims?.filter((item) => item.relationship === "FEMALE EMPLOYEE WITHOUT MATERNITY" && item.resubmissionFlag === "NO")
        const femaleEmployeeMClaimsCount = FemaleEmployeeMRelationClaims.length
        const femaleMClaimsClaimedAmount = FemaleEmployeeMRelationClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const FemaleEmployeeMRelationFinal = await claims?.filter((item) => item.relationship === "FEMALE EMPLOYEE WITHOUT MATERNITY")
        const femaleEmployeeMFinalAmount = FemaleEmployeeMRelationFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        //Male
        const maleRelationClaims = await claims?.filter((item) => item.relationship === "MALE EMPLOYEE" && item.resubmissionFlag === "NO")
        const maleClaimsCount = maleRelationClaims.length
        const maleClaimsClaimedAmount = maleRelationClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const maleRelationFinal = await claims?.filter((item) => item.relationship === "MALE EMPLOYEE")
        const maleFinalAmount = maleRelationFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        //SON
        const sonRelationClaims = await claims?.filter((item) => item.relationship === "SON" && item.resubmissionFlag === "NO")
        const sonClaimsCount = sonRelationClaims.length
        const sonClaimsClaimedAmount = sonRelationClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const sonRelationFinal = await claims?.filter((item) => item.relationship === "SON")
        const sonFinalAmount = sonRelationFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        //WIFE
        const wifeRelationClaims = await claims?.filter((item) => item.relationship === "WIFE" && item.resubmissionFlag === "NO")
        const wifeClaimsCount = wifeRelationClaims.length
        const wifeClaimsClaimedAmount = wifeRelationClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const wifeRelationFinal = await claims?.filter((item) => item.relationship === "WIFE")
        const wifeFinalAmount = wifeRelationFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        const claimsCountTotal = daughterClaimsCount + femaleEmployeeMClaimsCount + maleClaimsCount + sonClaimsCount + wifeClaimsCount
        const claimedAmountTotal = daughterClaimsClaimedAmount + femaleMClaimsClaimedAmount + maleClaimsClaimedAmount + sonClaimsClaimedAmount + wifeClaimsClaimedAmount
        const finalAmountTotal = daughterFinalAmount + femaleEmployeeMFinalAmount + maleFinalAmount + sonFinalAmount + wifeFinalAmount


        //Beneficiery Gender calculations

        //Male
        const maleBeneficieryClaims = await claims?.filter((item) => item.beneficiaryGender === "MALE" && item.resubmissionFlag === "NO")
        const maleBeneficieryClaimsCount = maleBeneficieryClaims.length
        const maleBeneficieryClaimedAmount = maleBeneficieryClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)
        //Total
        const maleBeneficieryFinal = await claims?.filter((item) => item.beneficiaryGender === "MALE")
        const maleBeneficieryFinalAmount = maleBeneficieryFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        //FeMale
        const femaleBeneficieryClaims = await claims?.filter((item) => item.beneficiaryGender === "FEMALE" && item.resubmissionFlag === "NO")
        const femaleBeneficieryClaimsCount = femaleBeneficieryClaims.length
        const femaleBeneficieryClaimedAmount = femaleBeneficieryClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        const femaleBeneficieryFinal = await claims?.filter((item) => item.beneficiaryGender === "FEMALE")
        const femaleBeneficieryFinalAmount = femaleBeneficieryFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)

        //Total
        const benefclaimsCountTotal = maleBeneficieryClaimsCount + femaleBeneficieryClaimsCount
        const benefclaimedAmountTotal = maleBeneficieryClaimedAmount + femaleBeneficieryClaimedAmount
        const beneffinalAmountTotal = maleBeneficieryFinalAmount + femaleBeneficieryFinalAmount


        const { sortedCitiesByClaimed, totalcitiesClaimedAmount, totalcitiesFinalAmount, claimedCount } = await getClaimsDataCategorySumAnalysis(tenantID);
        const { sortedProvidersByClaimed, totalHospitalClaimedAmount, totalHospitalFinalAmount, claimedCountProvider } = await getClaimsProviderNameanalysis(tenantID);
        const { sortedemployeeMemberByClaimed, totalEmployeeMemberClaimedAmount, totalemployeeMemberFinalAmount, claimedCountEmployeeMember } = await getClaimsEmployeeMemberanalysis(tenantID);
        const { sortedPrimaryICDByClaimed, totalPrimaryICDClaimedAmount, totalPrimaryICDFinalAmount, claimedCountPrimaryICD } = await getClaimsPrimaryICDanalysis(tenantID)
        const { sorteddiagnosisTypeByClaimed, totalDiagnosisTypeClaimedAmount, totaldaignosisTypeFinalAmount, claimedCountdaignosisType } = await getClaimsDiagnosisTypeanalysis(tenantID);




        // //Diagnosis Type

        // const diagnosisClaims = await claims?.filter((item) => item.diagnosisType === "BASIC" && item.resubmissionFlag === "NO")
        // const diagnosisClaimsCount = diagnosisClaims.length
        // const diagnosisClaimedAmount = diagnosisClaims.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        // const diagnosisFinal = await claims?.filter((item) => item.diagnosisType === "BASIC")
        // const diagnosisFinalAmount = diagnosisFinal.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)


        // const diagnosisClaimsCHRONIC = await claims?.filter((item) => item.diagnosisType === "CHRONIC" && item.resubmissionFlag === "NO")
        // const diagnosisClaimsCountCHRONIC = diagnosisClaimsCHRONIC.length
        // const diagnosisClaimedAmountCHRONIC = diagnosisClaimsCHRONIC.reduce((acc, item) => acc + parseFloat(item.claimedRequested.replace(/,/g, "")), 0)

        // const diagnosisFinalCHRONIC = await claims?.filter((item) => item.diagnosisType === "CHRONIC")
        // const diagnosisFinalAmountCHRONIC = diagnosisFinalCHRONIC.reduce((acc, item) => acc + parseFloat(item.settled_FinalAmount.replace(/,/g, "")), 0)
        // //total of diagnosis type
        // const totalDiagnosisCount = diagnosisClaimsCount + diagnosisClaimsCountCHRONIC
        // const totaldiagnosisClaimedamount = diagnosisClaimedAmount + diagnosisClaimedAmountCHRONIC
        // const totaldaignosisFinalAmount = diagnosisFinalAmount + diagnosisFinalAmountCHRONIC


        //Members data end results after calculations
        const {
            maleCount,
            femaleCount,
            totalGenderCount,
            maleEmployeeCount,
            femaleEmployeeCountMate,
            femaleEmployeeCountMate1,
            sonEmployeeCount,
            daughterEmployeeCount,
            totalRelationshipCount,
            ageGroupClaims

        } = await getMemberDataAnalysis(tenantID)
        const {
            employeeDepartmentArray,
            grandTotalCount,
            employeePositionArray,
            grandTotalPositionCount,
            employeeNationalityArray
        } = await getEmployee(tenantID)



        const {
            positionSalaryRangeArray
        } = await getPositionSalaryRange(tenantID)


        const {
            employeeAges
        } = await calculateEachemployeeAge(tenantID)

        //Get the values fro Rjac EB tool

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
            totalgraduity,
            durationOfLiability,
            salaryRate_X_1,
            salaryRate_X,
            finalslaryEscaltion,
            withralRate_X_1,
            withralRate_X,
            finalWitdrawl,

           
            aggregrateLeaveyear1,
            aggregrateLeaveyear2,
            aggregrateLeaveyear3,
            aggregrateLeaveyear4,
            aggregrateLeaveyear5,
            aggregrateLeaveyear6,

            openingLeaveX,
            openingLeaveX_1,
            openingLeaveX_2,
            closeingLeaveX,
            closeingLeaveX_1,
            closeingLeaveX_2


        } = await getSomeInfo(tenantID)


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




        // Analysis data to save 
        const analysisData = {
            tenant_id: tenantID,
            noOfClaims: {
                grandTotal: {
                    claims: totalClaims,
                    claimedAmount: totalClaimAmount,
                    finalAmount: totalFinalAmount,
                },
                providerClaimCount: {
                    ipdPaidClaim: totalipdPaidClaimAmountlength,
                    ipdUnPaidClaim: totalipdUnPaidClaimAmountlength,
                    opdPaidClaim: totalopdPaidClaimAmountlength,
                    opdUnPaidClaim: totalopdUnPaidClaimAmountlength,
                    totalproviderClaimCount: totalproviderClaimCount,
                    providerClaimsPercentageIPDpaidDisplay: providerClaimsPercentageIPDpaidDisplay,
                    providerClaimsPercentageIPDUnpaidDisplay: providerClaimsPercentageIPDUnpaidDisplay,
                    providerClaimsPercentageOPDpaidDisplay: providerClaimsPercentageOPDpaidDisplay,
                    providerClaimsPercentageOPDUnpaidDisplay: providerClaimsPercentageOPDUnpaidDisplay,
                    totalproviderClaimCountPercentageDisplay: totalproviderClaimCountPercentageDisplay
                },

                providerClaimAmount: {
                    ipdPaidClaimAmount: totalipdPaidClaimAmount,
                    ipdUnPaidClaimAmount: totalipdUnPaidClaimAmount,
                    opdPaidClaimAmount: totalopdPaidClaimAmount,
                    opdUnPaidClaimAmount: totalopdUnPaidClaimAmount,
                    totalproviderClaimAmount: totalproviderClaimAmount,
                    providerClaimsAmountPercentageIPDpaidDisplay: providerClaimsAmountPercentageIPDpaidDisplay,
                    providerClaimsAmountPercentageIPDUnpaidDisplay: providerClaimsAmountPercentageIPDUnpaidDisplay,
                    providerClaimsAmountPercentageOPDpaidDisplay: providerClaimsAmountPercentageOPDpaidDisplay,
                    providerClaimsAmountPercentageOPDUnpaidDisplay: providerClaimsAmountPercentageOPDUnpaidDisplay,
                    totalproviderClaimAmountPercentageDisplay: totalproviderClaimAmountPercentageDisplay
                },

                providerFinalAmount: {
                    ipdPaidFinalAmount: totalipdPaidFinalAmount,
                    ipdUnPaidFinalAmount: totalipdUnPaidFinalAmount,
                    opdPaidFinalAmount: totalopdPaidFinalAmount,
                    opdUnPaidFinalAmount: totalopdUnPaidFinalAmount,
                    totalproviderFinalAmount: totalproviderFinalAmount,
                    providerFinalsAmountPercentageIPDpaidDisplay: providerFinalAmountPercentageIPDpaidDisplay,
                    providerFinalsAmountPercentageIPDUnpaidDisplay: providerFinalAmountPercentageIPDUnpaidDisplay,
                    providerFinalsAmountPercentageOPDpaidDisplay: providerFinalAmountPercentageOPDpaidDisplay,
                    providerFinalsAmountPercentageOPDUnpaidDisplay: providerFinalAmountPercentageOPDUnpaidDisplay,
                    totalproviderFinalAmountPercentageDisplay: totalproviderFinalAmountPercentageDisplay
                },
                claimStatusFinalAmount: {
                    approvedCount:totalclaimStatusCountApprovedLength,
                    partiallyCount:totalclaimStatusCountPartiallyLength,
                    rejectedCount:totalclaimStatusCountRejectedLength,
                    approvedFinal: totalclaimStatusFinalApprovedAmount,
                    partialApproveFinal: totalclaimStatusFinalPartiallyAmount,
                    rejectedFinal: totalclaimStatusFinalRejectedAmount,
                },
            },


            relationships: {

                daughter: {
                    claimsCount: daughterClaimsCount,
                    claimedAmount: daughterClaimsClaimedAmount,
                    FinalAmount: daughterFinalAmount,
                },
                femaleWithoutM: {
                    claimsCount: femaleEmployeeMClaimsCount,
                    claimedAmount: femaleMClaimsClaimedAmount,
                    FinalAmount: femaleEmployeeMFinalAmount,
                },
                maleEmployee: {
                    claimsCount: maleClaimsCount,
                    claimedAmount: maleClaimsClaimedAmount,
                    FinalAmount: maleFinalAmount,
                },
                son: {
                    claimsCount: sonClaimsCount,
                    claimedAmount: sonClaimsClaimedAmount,
                    FinalAmount: sonFinalAmount,
                },
                wife: {
                    claimsCount: wifeClaimsCount,
                    claimedAmount: wifeClaimsClaimedAmount,
                    FinalAmount: wifeFinalAmount,
                },
                grandTotal: {
                    claimsCountTotal: claimsCountTotal,
                    claimedAmountTotal: claimedAmountTotal,
                    finalAmountTotal: finalAmountTotal,
                },
            },

            beneficieryGender: {
                Male: {
                    claimsCount: maleBeneficieryClaimsCount,
                    claimedAmount: maleBeneficieryClaimedAmount,
                    FinalAmount: maleBeneficieryFinalAmount,
                },
                FeMale: {
                    claimsCount: femaleBeneficieryClaimsCount,
                    claimedAmount: femaleBeneficieryClaimedAmount,
                    FinalAmount: femaleBeneficieryFinalAmount,
                },
                grandTotal: {
                    claimsCountTotal: benefclaimsCountTotal,
                    claimedAmountTotal: benefclaimedAmountTotal,
                    finalAmountTotal: beneffinalAmountTotal,
                },
            },
            benecitiesByCliamed: {
                cityData: sortedCitiesByClaimed,
                grandTotal: {
                    claimAmount: totalcitiesClaimedAmount,
                    finalAmount: totalcitiesFinalAmount,
                    totalClaimedCount: claimedCount
                }
            },
            providerName: {
                hospitalData: sortedProvidersByClaimed,
                grandTotal: {
                    claimAmount: totalHospitalClaimedAmount,
                    finalAmount: totalHospitalFinalAmount,
                    claimedCountProvider: claimedCountProvider,
                },
            },
            employeeMember: {
                emplyeeMemberData: sortedemployeeMemberByClaimed,
                grandTotal: {
                    claimAmount: totalEmployeeMemberClaimedAmount,
                    finalAmount: totalemployeeMemberFinalAmount,
                    claimedCountProvider: claimedCountEmployeeMember,
                },
            },
            primaryICDName: {
                primaryICDData: sortedPrimaryICDByClaimed,
                grandTotal: {
                    claimAmount: totalPrimaryICDClaimedAmount,
                    finalAmount: totalPrimaryICDFinalAmount,
                    claimedCountProvider: claimedCountPrimaryICD
                },
            },
            daignosisTypeNew: {
                daignosisTypeData: sorteddiagnosisTypeByClaimed,
                grandTotal: {
                    claimAmount: totalDiagnosisTypeClaimedAmount,
                    finalAmount: totaldaignosisTypeFinalAmount,
                    claimedCountProvider: claimedCountdaignosisType
                },
            },
            // daignosisType: {
            //     BasicDiagnosis: {
            //         claimsCount: diagnosisClaimsCount,
            //         claimedAmount: diagnosisClaimedAmount,
            //         FinalAmount: diagnosisFinalAmount,
            //     },
            //     ChronicDiagnosis: {
            //         claimsCount: diagnosisClaimsCountCHRONIC,
            //         claimedAmount: diagnosisClaimedAmountCHRONIC,
            //         FinalAmount: diagnosisFinalAmountCHRONIC,
            //     },
            //     grandTotal: {
            //         claimsCountTotal: totalDiagnosisCount,
            //         claimedAmountTotal: totaldiagnosisClaimedamount,
            //         finalAmountTotal: totaldaignosisFinalAmount,
            //     },
            // },
            membersData: {
                gender: {
                    male: maleCount,
                    female: femaleCount,
                    total: totalGenderCount
                },
                relationship: {
                    male: maleEmployeeCount,
                    femaleMaternity: femaleEmployeeCountMate,
                    femaleMaternity1:femaleEmployeeCountMate1,
                    son: sonEmployeeCount,
                    daughter: daughterEmployeeCount,
                    TotalRelationshipCount: totalRelationshipCount
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
                    PastDate: {
                        durationLiability: durationOfLiability,
                        withdrawlRate: {
                            yearX: withralRate_X,
                            yearX_1: withralRate_X_1,
                            final: finalWitdrawl
                        },
                        salaryEscalationRate: {
                            yearX: salaryRate_X,
                            yearX_1: salaryRate_X_1,
                            final: finalslaryEscaltion

                        }
                    }
                },
                Leaves: {
                    leaves: leavesArray,
                    leaveLiability: {
                      
                        year1: aggregrateLeaveyear1,
                        year2: aggregrateLeaveyear2,
                        year3: aggregrateLeaveyear3,
                        year4: aggregrateLeaveyear4,
                        year5: aggregrateLeaveyear5,
                        year6: aggregrateLeaveyear6,
                    },
                    openingLeave: {
                        yearX: openingLeaveX,
                        yearX_1: openingLeaveX_1,
                        yearX_2: openingLeaveX_2
                    },
                    closingLeave: {
                        yearX: closeingLeaveX,
                        yearX_1: closeingLeaveX_1,
                        yearX_2: closeingLeaveX_2
                    },
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



                    },
                    empNationality: employeeNationalityArray
                }

            },




        };

        const AnalysisModel = await getAnalysisModelUAE(tenantID);
        const newAnalysis = new AnalysisModel(analysisData);
        await newAnalysis.save();

        


        //beneficiery Nationality clamied and Final amount
        async function getClaimsDataCategorySumAnalysis(tenantID) {
            try {
                const ClaimsData = await getClaimDataModelUAE(tenantID);
                const claims = await ClaimsData.find();

                // Calculating totals by city
                const cityAmounts = {};
                let totalcitiesClaimedAmount = 0;
                let totalcitiesFinalAmount = 0;
                let claimedCount = 0; // Counter for claims with resubmissionFlag === "NO"

                claims.forEach(claim => {
                    const cityName = claim?.beneficieryNationality?.toLowerCase();
                    const finalAmount = parseFloat(claim.settled_FinalAmount);
                    totalcitiesFinalAmount += finalAmount;

                    if (claim.resubmissionFlag === "NO") {
                        const claimedAmount = parseFloat(claim.claimedRequested);
                        totalcitiesClaimedAmount += claimedAmount;
                        claimedCount++; // Increment the counter

                        if (cityName in cityAmounts) {
                            cityAmounts[cityName].claimed += claimedAmount;
                            cityAmounts[cityName].claimedCount += 1; // Increment the count
                        } else {
                            cityAmounts[cityName] = {
                                claimed: claimedAmount,
                                incurred: 0, // Initialize incurred to 0 for new cities
                                claimedCount: 1 // Initialize claimed count
                            };
                        }
                    }

                    if (cityName in cityAmounts) {
                        cityAmounts[cityName].incurred += finalAmount;
                    } else {
                        if (!cityAmounts[cityName]) {
                            cityAmounts[cityName] = {
                                claimed: 0, // Initialize claimed to 0 for new cities
                                incurred: finalAmount,
                                claimedCount: 0 // Initialize claimed count to 0 for new cities
                            };
                        }
                    }
                });

                const cityAmountsArray = Object.entries(cityAmounts).map(([city, amounts]) => ({
                    city: city.charAt(0).toUpperCase() + city.slice(1), // Capitalize city names
                    claimed: amounts.claimed,
                    incurred: amounts.incurred,
                    claimedCount: amounts.claimedCount // Include the count of claimed amounts
                }));

                const sortedCitiesByClaimed = cityAmountsArray.sort((a, b) => b.claimed - a.claimed);

                return { sortedCitiesByClaimed, totalcitiesClaimedAmount, totalcitiesFinalAmount, claimedCount };
            } catch (error) {
                // console.log(error);
                throw new Error("Failed to fetch claims");
            }
        };



        //Provider Name clamied and Final amount and cliam count
        // async function getClaimsProviderNameanalysis(tenantID) {
        //     try {
        //         const ClaimsData = await getClaimDataModelUAE(tenantID);
        //         const claims = await ClaimsData.find();

        //         // Initialize data structures
        //         const providerNameData = {};
        //         let totalHospitalClaimedAmount = 0;
        //         let totalHospitalFinalAmount = 0;
        //         let claimedCountProvider = 0;

        //         // Process each claim
        //         claims.forEach(claim => {
        //             const providerName = claim?.providerName?.toLowerCase();
        //             const providercity = claim?.providerCity
        //             const finalAmount = parseFloat(claim.settled_FinalAmount);

        //             // Accumulate final amount totals
        //             totalHospitalFinalAmount += finalAmount;

        //             // Process claims with resubmissionFlag === "NO"
        //             if (claim.resubmissionFlag === "NO") {
        //                 const claimedAmount = parseFloat(claim.claimedRequested);
        //                 totalHospitalClaimedAmount += claimedAmount;
        //                 claimedCountProvider++; // Increment claimed count

        //                 // Update or initialize providerNameData for the current provider
        //                 if (providerName in providerNameData) {
        //                     providerNameData[providerName].claimed += claimedAmount;
        //                     providerNameData[providerName].claimedCountProvider++; // Increment claimed count for the provider
        //                 } else {
        //                     providerNameData[providerName] = {
        //                         claimed: claimedAmount,
        //                         incurred: 0,
        //                         claimedCountProvider: 1
        //                     };
        //                 }
        //             }

        //             // Accumulate incurred amounts
        //             if (providerName in providerNameData) {
        //                 providerNameData[providerName].incurred += finalAmount;
        //             } else {
        //                 providerNameData[providerName] = {
        //                     claimed: 0,
        //                     incurred: finalAmount,
        //                     claimedCountProvider: 0
        //                 };
        //             }
        //         });

        //         // Convert providerNameData to an array for sorting and return
        //         const providerNameArray = Object.entries(providerNameData).map(([provider, amounts]) => ({
        //             provider: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider names
        //             claimed: amounts.claimed,
        //             incurred: amounts.incurred,
        //             claimedCountProvider: amounts.claimedCountProvider
        //         }));

        //         // Sort providers by claimed amount
        //         const sortedProvidersByClaimed = providerNameArray.sort((a, b) => b.claimed - a.claimed);

        //         return { sortedProvidersByClaimed, totalHospitalClaimedAmount, totalHospitalFinalAmount, claimedCountProvider };
        //     } catch (error) {
        //         console.log(error);
        //         throw new Error("Failed to fetch claims");
        //     }
        // };


        async function getClaimsProviderNameanalysis(tenantID) {
            try {
              const ClaimsData = await getClaimDataModelUAE(tenantID);
              const claims = await ClaimsData.find();
          
              // Initialize data structures
              const providerNameData = {};
              let totalHospitalClaimedAmount = 0;
              let totalHospitalFinalAmount = 0;
              let claimedCountProvider = 0;
          
              // Process each claim
              claims.forEach(claim => {
                const providerName = claim?.providerName?.toLowerCase();
                const providerCity = claim?.providerCity;
                const finalAmount = parseFloat(claim.settled_FinalAmount);
          
                // Accumulate final amount totals
                totalHospitalFinalAmount += finalAmount;
          
                // Process claims with resubmissionFlag === "NO"
                if (claim.resubmissionFlag === "NO") {
                  const claimedAmount = parseFloat(claim.claimedRequested);
                  totalHospitalClaimedAmount += claimedAmount;
                  claimedCountProvider++; // Increment claimed count
          
                  // Update or initialize providerNameData for the current provider
                  if (providerName in providerNameData) {
                    providerNameData[providerName].claimed += claimedAmount;
                    providerNameData[providerName].claimedCountProvider++; 
                  } else {
                    providerNameData[providerName] = {
                      claimed: claimedAmount,
                      incurred: 0,
                      claimedCountProvider: 1,
                      providerCity: providerCity // Store the provider city
                    };
                  }
                }
          
                // Accumulate incurred amounts
                if (providerName in providerNameData) {
                  providerNameData[providerName].incurred += finalAmount;
                } else {
                  providerNameData[providerName] = {
                    claimed: 0,
                    incurred: finalAmount,
                    claimedCountProvider: 0,
                    providerCity: providerCity // Store the provider city
                  };
                }
              });
          
              // Convert providerNameData to an array for sorting and return
              const providerNameArray = Object.entries(providerNameData).map(([provider, amounts]) => ({
                provider: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider names
                claimed: amounts.claimed,
                incurred: amounts.incurred,
                claimedCountProvider: amounts.claimedCountProvider,
                providerCity: amounts.providerCity // Include the provider city
              }));
          
              // Sort providers by claimed amount
              const sortedProvidersByClaimed = providerNameArray.sort((a, b) => b.claimed - a.claimed);
          
              return { sortedProvidersByClaimed, totalHospitalClaimedAmount, totalHospitalFinalAmount, claimedCountProvider };
            } catch (error) {
            //   console.log(error);
              throw new Error("Failed to fetch claims");
            }
          }
          

        //Provider Name clamied and Final amount and cliam count
        async function getClaimsEmployeeMemberanalysis(tenantID) {
            try {
                const ClaimsData = await getClaimDataModelUAE(tenantID);
                const claims = await ClaimsData.find();

                // Initialize data structures
                const employeeMemberData = {};
                let totalEmployeeMemberClaimedAmount = 0;
                let totalemployeeMemberFinalAmount = 0;
                let claimedCountEmployeeMember = 0;

                // Process each claim
                claims.forEach(claim => {
                    const providerName = claim?.employeeMemberNo?.toLowerCase();
                    const finalAmount = parseFloat(claim.settled_FinalAmount);

                    // Accumulate final amount totals
                    totalemployeeMemberFinalAmount += finalAmount;

                    // Process claims with resubmissionFlag === "NO"
                    if (claim.resubmissionFlag === "NO") {
                        const claimedAmount = parseFloat(claim.claimedRequested);
                        totalEmployeeMemberClaimedAmount += claimedAmount;
                        claimedCountEmployeeMember++; // Increment claimed count

                        // Update or initialize employeeMemberData for the current provider
                        if (providerName in employeeMemberData) {
                            employeeMemberData[providerName].claimed += claimedAmount;
                            employeeMemberData[providerName].claimedCountEmployeeMember++; // Increment claimed count for the provider
                        } else {
                            employeeMemberData[providerName] = {
                                claimed: claimedAmount,
                                incurred: 0,
                                claimedCountEmployeeMember: 1
                            };
                        }
                    }

                    // Accumulate incurred amounts
                    if (providerName in employeeMemberData) {
                        employeeMemberData[providerName].incurred += finalAmount;
                    } else {
                        employeeMemberData[providerName] = {
                            claimed: 0,
                            incurred: finalAmount,
                            claimedCountEmployeeMember: 0
                        };
                    }
                });

                // Convert employeeMemberData to an array for sorting and return
                const providerNameArray = Object.entries(employeeMemberData).map(([provider, amounts]) => ({
                    provider: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider names
                    claimed: amounts.claimed,
                    incurred: amounts.incurred,
                    claimedCountEmployeeMember: amounts.claimedCountEmployeeMember
                }));

                // Sort providers by claimed amount
                const sortedemployeeMemberByClaimed = providerNameArray.sort((a, b) => b.claimed - a.claimed);

                return { sortedemployeeMemberByClaimed, totalEmployeeMemberClaimedAmount, totalemployeeMemberFinalAmount, claimedCountEmployeeMember };
            } catch (error) {
                console.log(error);
                throw new Error("Failed to fetch claims");
            }
        };


        //Primary ICD description clamied and Final amount and cliam count
        async function getClaimsPrimaryICDanalysis(tenantID) {
            try {
                const ClaimsData = await getClaimDataModelUAE(tenantID);
                const claims = await ClaimsData.find();

                // Initialize data structures
                const primaryICDdata = {};
                let totalPrimaryICDClaimedAmount = 0;
                let totalPrimaryICDFinalAmount = 0;
                let claimedCountPrimaryICD = 0;

                // Process each claim
                claims.forEach(claim => {
                    const primaryICD = claim?.primaryICDdescription?.toLowerCase();
                    const finalAmount = parseFloat(claim.settled_FinalAmount);

                    // Accumulate final amount totals
                    totalPrimaryICDFinalAmount += finalAmount;

                    // Process claims with resubmissionFlag === "NO"
                    if (claim.resubmissionFlag === "NO") {
                        const claimedAmount = parseFloat(claim.claimedRequested);
                        totalPrimaryICDClaimedAmount += claimedAmount;
                        claimedCountPrimaryICD++; // Increment claimed count

                        // Update or initialize primaryICDdata for the current provider
                        if (primaryICD in primaryICDdata) {
                            primaryICDdata[primaryICD].claimed += claimedAmount;
                            primaryICDdata[primaryICD].claimedCountPrimaryICD++; // Increment claimed count for the provider
                        } else {
                            primaryICDdata[primaryICD] = {
                                claimed: claimedAmount,
                                incurred: 0,
                                claimedCountPrimaryICD: 1
                            };
                        }
                    }

                    // Accumulate incurred amounts
                    if (primaryICD in primaryICDdata) {
                        primaryICDdata[primaryICD].incurred += finalAmount;
                    } else {
                        primaryICDdata[primaryICD] = {
                            claimed: 0,
                            incurred: finalAmount,
                            claimedCountPrimaryICD: 0
                        };
                    }
                });

                // Convert primaryICDdata to an array for sorting and return
                const primaryICDArray = Object.entries(primaryICDdata).map(([provider, amounts]) => ({
                    primaryICD: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider names
                    claimed: amounts.claimed,
                    incurred: amounts.incurred,
                    claimedCountPrimaryICD: amounts.claimedCountPrimaryICD
                }));

                // Sort providers by claimed amount
                const sortedPrimaryICDByClaimed = primaryICDArray.sort((a, b) => b.claimed - a.claimed);

                return { sortedPrimaryICDByClaimed, totalPrimaryICDClaimedAmount, totalPrimaryICDFinalAmount, claimedCountPrimaryICD };
            } catch (error) {
                console.log(error);
                throw new Error("Failed to fetch claims");
            }
        };


        //Members analysis caluations logics are starts
        async function getMemberDataAnalysis(tenantID) {

            try {

                //Gender Analysis
                const MemberData = await getMeberDataModel(tenantID)
                const members = await MemberData.find()

                const male = await members?.filter((item) => item?.gender === "MALE" || item?.Gender === "Male")
                const maleCount = male.length

                const Female = await members?.filter((item) => item?.gender === "FEMALE" || item?.Gender === "Female")
                const femaleCount = Female.length

                const totalGenderCount = maleCount + femaleCount

                //Realtionship analysis
                const maleEmployee = await members?.filter((item) => item?.relationship === "MALE EMPLOYEE" || item?.relationship === "Male Employee")
                const maleEmployeeCount = maleEmployee?.length


                const femaleEmployeeMate1 = await members?.filter((item) => item?.relationship === "FEMALE EMPLOYEE WITH MATERNITY" || item?.relationship === "Female Employee With Maternity")
                const femaleEmployeeCountMate1 = femaleEmployeeMate1?.length


                const femaleEmployeeMate = await members?.filter((item) => item?.relationship === "FEMALE EMPLOYEE WITHOUT MATERNITY" || item?.relationship === "Female Employee Without Maternity")
                const femaleEmployeeCountMate = femaleEmployeeMate?.length

                const sonEmployee = await members?.filter((item) => item?.relationship === "SON" || item?.relationship === "Son")
                const sonEmployeeCount = sonEmployee?.length

                const daughterEmployee = await members?.filter((item) => item?.relationship === "DAUGHTER" || item?.relationship === "Daughter")
                const daughterEmployeeCount = daughterEmployee?.length

                const totalRelationshipCount = maleEmployeeCount + femaleEmployeeCountMate + sonEmployeeCount + daughterEmployeeCount +femaleEmployeeCountMate1


                //Age Band sumAssured calculations

                // const calculateAge = (dateOfBirth) => {
                //     const dob = new Date(dateOfBirth);
                //     const today = new Date();
                //     let age = today.getFullYear() - dob.getFullYear();
                //     console.log("----------fwefefwef",age ,"dateeeeeeeeeeeeeeeeee",dob)
                   
                //     const monthDiff = today.getMonth() - dob.getMonth();
                //     if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                //         age--;
                //     }
                //     // Ensure age is non-negative
                //     return Math.max(age, 0);
                // };

                const parseDate = (dateStr) => {
                    // Split the date string by `/` or `-`
                    const parts = dateStr.split(/[\/\-]/);
                    if (parts.length === 3) {
                      let day, month, year;
                  
                      // Ensure day and month are two digits
                      day = parts[0].length === 1 ? `0${parts[0]}` : parts[0];
                      month = parts[1].length === 1 ? `0${parts[1]}` : parts[1];
                  
                      // Determine the correct century for two-digit years
                      if (parts[2].length === 2) {
                        year = parseInt(parts[2], 10) > 22 ? `19${parts[2]}` : `20${parts[2]}`;
                      } else {
                        year = parts[2];
                      }
                  
                      // Return date in YYYY-MM-DD format
                      return `${year}-${month}-${day}`;
                    }
                    return null;
                  };
                  
                  const calculateAge = (dateOfBirth) => {
                    const dobString = parseDate(dateOfBirth);
                    if (!dobString) {
                      console.error('Invalid date format:', dateOfBirth);
                      return null;
                    }
                  
                    const dob = new Date(dobString);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                      age--;
                    }
                  
                    // Ensure age is non-negative and within a reasonable range
                    if (age < 0 || age > 120) {
                      console.error('Invalid age calculated:', age, 'for date of birth:', dateOfBirth);
                      return null;
                    }
                  
                    return age;
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
                    const age = calculateAge(member.dateOfBirth);
                    const ageRange = groupByAgeRange(age);
                    const proposedSumInsured = member.newOrProposedSumInsured.replace(/,/g, ''); // Remove commas

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

                });

                return {

                    maleCount,
                    femaleCount,
                    totalGenderCount,
                    maleEmployeeCount,
                    femaleEmployeeCountMate,
                    femaleEmployeeCountMate1,
                    sonEmployeeCount,
                    daughterEmployeeCount,
                    totalRelationshipCount,
                    ageGroupClaims


                }


            } catch (error) {
                console.log(error)

                return res.status(500).json({ msg: "Failed to fetch members" });
            }

        }

        //Diagnosis Type claimed count amount

        async function getClaimsDiagnosisTypeanalysis(tenantID) {
            try {
                const ClaimsData = await getClaimDataModelUAE(tenantID);
                const claims = await ClaimsData.find();

                // Initialize data structures
                const daignosisTypedata = {};
                let totalDiagnosisTypeClaimedAmount = 0;
                let totaldaignosisTypeFinalAmount = 0;
                let claimedCountdaignosisType = 0;

                // Process each claim
                claims.forEach(claim => {
                    const daignosisTypeICD = claim?.diagnosisType?.toLowerCase();
                    const finalAmount = parseFloat(claim.settled_FinalAmount);

                    // Accumulate final amount totals
                    totaldaignosisTypeFinalAmount += finalAmount;

                    // Process claims with resubmissionFlag === "NO"
                    if (claim.resubmissionFlag === "NO") {
                        const claimedAmount = parseFloat(claim.claimedRequested);
                        totalDiagnosisTypeClaimedAmount += claimedAmount;
                        claimedCountdaignosisType++; // Increment claimed count

                        // Update or initialize daignosisTypedata for the current provider
                        if (daignosisTypeICD in daignosisTypedata) {
                            daignosisTypedata[daignosisTypeICD].claimed += claimedAmount;
                            daignosisTypedata[daignosisTypeICD].claimedCountdaignosisType++; // Increment claimed count for the provider
                        } else {
                            daignosisTypedata[daignosisTypeICD] = {
                                claimed: claimedAmount,
                                incurred: 0,
                                claimedCountdaignosisType: 1
                            };
                        }
                    }

                    // Accumulate incurred amounts
                    if (daignosisTypeICD in daignosisTypedata) {
                        daignosisTypedata[daignosisTypeICD].incurred += finalAmount;
                    } else {
                        daignosisTypedata[daignosisTypeICD] = {
                            claimed: 0,
                            incurred: finalAmount,
                            claimedCountdaignosisType: 0
                        };
                    }
                });

                // Convert daignosisTypedata to an array for sorting and return
                const primaryICDArray = Object.entries(daignosisTypedata).map(([provider, amounts]) => ({
                    daignosisTypeICD: provider.charAt(0).toUpperCase() + provider.slice(1), // Capitalize provider names
                    claimed: amounts.claimed,
                    incurred: amounts.incurred,
                    claimedCountdaignosisType: amounts.claimedCountdaignosisType
                }));

                // Sort providers by claimed amount
                const sorteddiagnosisTypeByClaimed = primaryICDArray.sort((a, b) => b.claimed - a.claimed);

                return { sorteddiagnosisTypeByClaimed, totalDiagnosisTypeClaimedAmount, totaldaignosisTypeFinalAmount, claimedCountdaignosisType };
            } catch (error) {
                console.log(error);
                throw new Error("Failed to fetch claims");
            }
        };



        //Get the Gratuity and Leave Data from the Rjac EB tool

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
     
            try {
                const { gradData, leaveinfo } = await getSomeInfoFromRJACApplication()

                const leaveInfo = await leaveinfo?.filter(item => item?.client?.totalConnect_id == tenantID)
             

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
                const totalgraduity = parseFloat(aggregrateyear1 + aggregrateyear2 + aggregrateyear3 + aggregrateyear4 + aggregrateyear5 + aggregrateyear6)


                const salaryesca1st3years = gradinfo?.salary_escalation?.first3years || 0
                const salaryescafter3years = gradinfo?.salary_escalation?.after3years || 0

                const fixedAttrition = gradinfo?.attrition?.fixed_withdrawal_rat || 0
                const terminationAttrition = gradinfo?.attrition?.termination_weightage || 0
                const resignationAttrition = gradinfo?.attrition?.resignation_weightage || 0
                const withdrawrateone = gradinfo?.employee_data?.sensitivity_analysis?.withdrawalRatwPlus1 || 0

                //duration of liability
                const durationOfLiability = gradinfo?.discount_rate?.duaration_of_liablity || 0

                //Withral Rate 
                const withralRate_X = gradinfo?.past_data?.present_yr_withRate || 0
                const withralRate_X_1 = gradinfo?.past_data?.last_yr_withRate || 0
                const finalWitdrawl = gradinfo?.attrition?.fixed_withdrawal_rat || 0

                //salary Escalation
                const salaryRate_X = gradinfo?.past_data?.prsYrSalRate || 0
                const salaryRate_X_1 = gradinfo?.past_data?.lastYrSalRate || 0
                const finalslaryEscaltion = gradinfo?.salary_escalation?.first3years || 0

                //Leave liability values 
               
                const aggregrateLeaveyear1 = leaveInfo[0]?.aggregrate?.totalYear1 || 0
                const aggregrateLeaveyear2 = leaveInfo[0]?.aggregrate?.totalYear2 || 0
                const aggregrateLeaveyear3 = leaveInfo[0]?.aggregrate?.totalYear3 || 0
                const aggregrateLeaveyear4 = leaveInfo[0]?.aggregrate?.totalYear4 || 0
                const aggregrateLeaveyear5 = leaveInfo[0]?.aggregrate?.totalYear5 || 0
                const aggregrateLeaveyear6 = leaveInfo[0]?.aggregrate?.totalYear6 || 0


                const openingLeaveX = leaveInfo[0]?.leave_rules_result?.yearX?.opening || 0
                const openingLeaveX_1 = leaveInfo[0]?.leave_rules_result?.yearXminus1?.opening || 0
                const openingLeaveX_2 = leaveInfo[0]?.leave_rules_result?.yearXminus2?.opening || 0

                const closeingLeaveX = leaveInfo[0]?.leave_rules_result?.yearX?.closing || 0
                const closeingLeaveX_1 = leaveInfo[0]?.leave_rules_result?.yearXminus1?.closing || 0
                const closeingLeaveX_2 = leaveInfo[0]?.leave_rules_result?.yearXminus2?.closing || 0

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
                        totalgraduity,
                        durationOfLiability,
                        salaryRate_X_1,
                        salaryRate_X,
                        finalslaryEscaltion,
                        withralRate_X_1,
                        withralRate_X,
                        finalWitdrawl,
                       
                        aggregrateLeaveyear1,
                        aggregrateLeaveyear2,
                        aggregrateLeaveyear3,
                        aggregrateLeaveyear4,
                        aggregrateLeaveyear5,
                        aggregrateLeaveyear6,
                        openingLeaveX,
                        openingLeaveX_1,
                        openingLeaveX_2,
                        closeingLeaveX,
                        closeingLeaveX_1,
                        closeingLeaveX_2

                    }
                } else {
                    console.log("No info found with ID:", tenantID);
                    return ("No info found with ID:", tenantID)

                }




            } catch (error) {
                console.log(error)
                throw error

            }
        }

    } catch (error) {
        console.error("Error calculating claims data:", error);
    }

};

//Get employee claims data

exports.getEmployeeClaimsData = async (req, res) => {

    try {
      const { employeeMemberNo, tenantID } = req.body; 
  
      // Assuming getClaimDataModelUAE returns a model (e.g., a Mongoose model), use it to query the data
      const claimDataModel = await getClaimDataModelUAE(tenantID);
      
      // Find employee claims data using findOne with employeeMemberNo
      const employeeClaimsData = await claimDataModel.findOne({ employeeMemberNo: employeeMemberNo });
      
      // If no employee found, return a 404 error
      if (!employeeClaimsData) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Send the employee's claims data as the response
      return res.status(200).json(employeeClaimsData);
  
    } catch (error) {
      // Handle errors
      console.error(error);
      return res.status(500).json({ message: 'Server error', error });
    }
  };


async function getEmployee(tenantID) {

    try {
        const EmployeeData = await getEmployeeUAEModel(tenantID)

        const Employee = await EmployeeData.find()

        const employeeDepartment = {}
        const employeeNationality = {}
        let employeeDepartmentSalary = 0
        const employeePosition = {}
        let employeePositionSalary = 0


        Employee.forEach(emp => {
            const departmentName = emp.department;
            const positionName = emp.position;
            const salary = parseFloat(emp?.currentSalary);
            const nationality = emp.employee_nationality



            if (!(departmentName in employeeDepartment)) {
                employeeDepartment[departmentName] = {
                    noOfemp: 0,
                    employeesSalary: 0,
                    positions: {}
                };
            }



            employeeDepartment[departmentName].noOfemp++;
            employeeDepartment[departmentName].employeesSalary += salary;




            if (!(nationality in employeeNationality)) {
                employeeNationality[nationality] = {
                    noOfemp: 0,
                    employeesSalary: 0,
                    positions: {}
                };
            }

            employeeNationality[nationality].noOfemp++;
            employeeNationality[nationality].employeesSalary += salary;


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



        const employeeNationalityArray = Object.entries(employeeNationality).map(([nationality, data]) => ({
            nationality: nationality,
            numberEmp: data.noOfemp
        }))
      

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
       
        const grandTotalPositionCount = employeePositionArray?.reduce((total, { numberEmp }) => total + numberEmp, 0);

      

        return {
            employeeDepartmentArray,

            grandTotalCount,
            employeePositionArray,
            grandTotalPositionCount,
            employeeNationalityArray
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal Server Error" });
    }
}


async function getPositionSalaryRange(tenantID) {
    try {
        const EmployeeData = await getEmployeeUAEModel(tenantID)

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
        console.log(error)
        throw error
    }
}



async function calculateEachemployeeAge(tenantID) {
    try {
        const EmployeeData = await getEmployeeUAEModel(tenantID);
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
        console.log(error);
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


async function getRFQAnalysis(tenantID) {
    try {
      const RFQData = await getRFQModel(tenantID);
      const rfq = await RFQData.find();

      const ClaimsDataModel = await getClaimDataModelUAE(tenantID);
      const claims = await ClaimsDataModel.find();
  
      // Calculate totalFinalAmount
      const totalFinalAmount = claims.reduce((total, claim) => {
        const finalAmount = parseFloat(claim.settled_FinalAmount.replace(/,/g, ""));
        return total + finalAmount;
      }, 0);
  
      // Total number of claims
      const totalClaims = claims.filter(claim => claim.resubmissionFlag === "NO").length;

  
      // Use totalClaims and totalFinalAmount as needed
      const no_of_claims = totalClaims;
     
  
      const total_incurred_claims = totalFinalAmount;

      // Inception premiums directly from rfq
      const inception_premiums = await rfq[0]?.policy_summary?.premiums?.inception;
      const total_premiums = await rfq[0]?.policy_summary?.premiums?.finalAtClaimsDate;
      const inception_members = await rfq[0]?.members_summary?.employees?.inception?.lives;
  
      const inception_per_life_rate1 = inception_premiums / inception_members;
      const inception_per_life_rate2 = inception_per_life_rate1.toFixed(0);
  
      const members_at_end = await rfq[0]?.members_summary?.employees?.renewal?.lives;
  
      const assumed_past_exposure_sum = parseInt(inception_members) + parseInt(members_at_end);
      const assumed_past_exposure_average = assumed_past_exposure_sum / 2;
      const assumed_past_exposure = assumed_past_exposure_average;
    //   console.log(assumed_past_exposure);
  
      const cliam_incident_rate = (no_of_claims / assumed_past_exposure * 100).toFixed(2);
    //   console.log(cliam_incident_rate);
  
      const claims_average = Math.round(total_incurred_claims / no_of_claims);
    //   console.log("claims_average-------",claims_average);
  
      const total_policy_days = await rfq[0]?.policy_summary?.total_Policy_Days;
      const policy_left_days = await rfq[0]?.policy_summary?.policy_Left_Days;
  
      const anualization_factor = ((policy_left_days / total_policy_days) * 100).toFixed(4);
    //   console.log("anualization_factor:", anualization_factor);
  
      const anualization_factor1 = parseFloat(anualization_factor) / 100;
    //   console.log("anualization_factor1:", anualization_factor1);
  
      const annualised_claims = Math.round(((total_incurred_claims / (1 - anualization_factor1))).toFixed(2));
    //   console.log(1 - anualization_factor1);
    //   console.log("annualised_claims: ", annualised_claims);
  
      const IBNR_percentage = 2.00;
      const claims_inflation_percentage = 4.00;
      const TPA_percentage = 2.5;
      const expenses_percentage = 2.5;
      const brokerage_percentage = 7.50;
      const margin_percentage = 5.0;
  
      const IBNR = Math.round(annualised_claims * IBNR_percentage / 100);
    //   console.log(IBNR);
  
      const Expected_Ultimate = annualised_claims + IBNR;
    //   console.log(Expected_Ultimate);
  
      const Ultimate_Loss_Ratio = (Expected_Ultimate / total_premiums) * 100;
    //   console.log("Ultimate_Loss_Ratio--------->",Ultimate_Loss_Ratio.toFixed(1));
  
      let Expected_Claims_with_Inflation;
      let Cost_per_life;
      let Risk_Premium_based_on_burn;
      let Gross_Premium_without_Brokerage;
      let Gross_Premium_with_Brokerage;
      let Obtained_Loss_ratio;
      let Estimated_Per_Life_Rate;
  
      if (Ultimate_Loss_Ratio >= 70) {
        // console.log("iam > 70");
  
        Expected_Claims_with_Inflation = Math.round(Expected_Ultimate * (1 + claims_inflation_percentage / 100));
        Cost_per_life = Expected_Claims_with_Inflation / assumed_past_exposure;
        Risk_Premium_based_on_burn = Cost_per_life * members_at_end;
        Gross_Premium_without_Brokerage = Risk_Premium_based_on_burn / (1 - (TPA_percentage / 100 + expenses_percentage / 100 + margin_percentage / 100));
        Gross_Premium_with_Brokerage = Gross_Premium_without_Brokerage * (1 + brokerage_percentage / 100);
        Obtained_Loss_ratio = (Risk_Premium_based_on_burn / Gross_Premium_without_Brokerage) * 100;
        Estimated_Per_Life_Rate = Math.ceil(Gross_Premium_without_Brokerage / members_at_end);
  
      } else {
        // console.log("iam < 70");
        Expected_Claims_with_Inflation = Math.round(Expected_Ultimate * (1 + claims_inflation_percentage / 100));
        Cost_per_life = Expected_Claims_with_Inflation / assumed_past_exposure;
        Risk_Premium_based_on_burn = Cost_per_life * members_at_end;
        Gross_Premium_without_Brokerage = Risk_Premium_based_on_burn / (1 - (TPA_percentage / 100 + expenses_percentage / 100 + margin_percentage / 100));
        Gross_Premium_with_Brokerage = Gross_Premium_without_Brokerage * (1 + brokerage_percentage / 100);
        Obtained_Loss_ratio = (Risk_Premium_based_on_burn / Gross_Premium_without_Brokerage) * 100;
        Estimated_Per_Life_Rate = Math.ceil(Gross_Premium_without_Brokerage / members_at_end);
      }
    //   console.log(Expected_Claims_with_Inflation);
    //   console.log(Cost_per_life);
    //   console.log(Risk_Premium_based_on_burn);
  
      const a = parseFloat(Gross_Premium_without_Brokerage?.toFixed(2)) ? parseFloat(Gross_Premium_without_Brokerage.toFixed(2)) : null;
  
    //   console.log(a);
  
      const roundedValue = Math.ceil(a);
    //   console.log(roundedValue);
  
    //   console.log(Gross_Premium_with_Brokerage);
    //   console.log(Obtained_Loss_ratio);
    //   console.log(Estimated_Per_Life_Rate);
  
      return {
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
  