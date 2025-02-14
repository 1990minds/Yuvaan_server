const xlsx = require("xlsx");
const fs = require("fs");
const moment = require('moment');
const getRFQModel = require("../model/rfqUAE");



exports.uploadRFQExcelUAE = async (req, res) => {
  const tenantID = req.params.tenantID;
  const RfqData = await getRFQModel(tenantID);

  const file = req.file;
  if (!file) {
    return res.status(400).json({ msg: "No file uploaded." });
  }

  if (!file.originalname.match(/\.(xlsx|xls)$/)) {
    fs.unlinkSync(`./uploads/${req.file.filename}`);
    return res.status(400).json({ msg: "Only excel files are supported." });
  }

  try {
    let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);

    const sheet2Data = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[1]]
    );

 

    const sheet3Data = xlsx.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[2]]
    );
   

    const combinedData = sheet2Data.map((row, index) => {

      const expiryStartDate = moment(row["Risk start date (expiry period)"], 'DD/MM/YYYY');
      const expiryEndDate = moment(row["Risk end date (expiry period)"], 'DD/MM/YYYY');
      const renewalStartDate = moment(row["Risk start date (Renewal)"], 'DD/MM/YYYY');
      const renewalEndDate = moment(row["Risk end date (Renewal)"], 'DD/MM/YYYY');
      const claimsAsOnDate = moment(row["Claims As on Date"], 'DD/MM/YYYY');

      const expiryTotalDays = expiryEndDate.diff(expiryStartDate, 'days');
 
      const renewalTotalDays = renewalEndDate.diff(renewalStartDate, 'days') + 1;
      

      const policyRunDays = claimsAsOnDate.diff(expiryStartDate, 'days');
      

      const policyLeftDays = expiryTotalDays - policyRunDays;
   


      return {
        tenant_id: tenantID,
        policy_summary: {
          riskPeriod: {
            expiry: {
              startDate: expiryStartDate.format('DD/MM/YYYY'),
              endDate: expiryEndDate.format('DD/MM/YYYY'),

            },
            renewal: {
              startDate: renewalStartDate.format('DD/MM/YYYY'),
              endDate: renewalEndDate.format('DD/MM/YYYY'),
              totalDays: renewalTotalDays
            }
          },
          claims: {
            asOnDate: claimsAsOnDate.format('DD/MM/YYYY'),
            // settled: row["Claims Settled"],
            // outstanding: row["Claims Outstandings"],
            // totalIncurred: row["Total Incurred Claims"],
            // numberOfClaims: row["Number of claims"]
          },
          premiums: {
            inception: row["Inception Premiums"],
            endorsement: row["Endorsement Premium"],
            finalAtClaimsDate: row["Final Premium (As at Claims Date)"]
          },
          total_Policy_Days: expiryTotalDays,
          policy_Run_Days: policyRunDays,
          policy_Left_Days: policyLeftDays

        },

        members_summary: {
          employees: {
            inception: {
              employees: sheet3Data[index]["Number of employees @ Inception"],
              dependents: sheet3Data[index]["Number of dependent @ Inception"],
              lives: sheet3Data[index]["Number of Lives @ Inception"]
            },
            expiry: {
              employees: sheet3Data[index]["Number of employees @ expiry (as on claim date)"],
              dependents: sheet3Data[index]["Number of dependent @ expiry (as on claim date)"],
              lives: sheet3Data[index]["Number of Lives @ expiry (as on claim date)"]
            },
            renewal: {
              employees: sheet3Data[index]["Number of employees @ Renewal"],
              dependents: sheet3Data[index]["Number of dependent @ Renewal"],
              lives: sheet3Data[index]["Number of Lives renewal"]
            }
          }
        },
      };
    });


    const rfqData = await RfqData.create(combinedData);

    fs.unlinkSync(`./uploads/${req.file.filename}`);

    return res
      .status(200)
      .json({ msg: "'Data stored successfully.'", rfqData });
  } catch (error) {
   
    return res.status(500).json("Error storing data: " + error.message);
  }
};

exports.getRFQDataUAE = async (req, res) => {
  const tenantID = req.params.tenantID;
  try {
    // Assuming you have a function called getRFQModel to fetch RFQ data
    const rfqData = await getRFQModel(tenantID)
    const data = await rfqData.findOne().sort({ createdAt: -1 });
    return res.status(200).json({ data });
  } catch (error) {
   
    return res.status(500).json("Error fetching RFQ data: " + error.message);
  }
};



