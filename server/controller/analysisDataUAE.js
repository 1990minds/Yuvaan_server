const getAnalysisModelUAE = require('../model/analysisDataUAE');
const { calculateClaimsDataUAE } = require('./claimsDataUAE');

exports.getAnalysisDataUAE = async (req, res) => {
  try {
    const tenantID = req.params.tenantID;

    await calculateClaimsDataUAE({ params: { tenantID } }, res);

    const analysisDataModel = await getAnalysisModelUAE(tenantID);
    // console.log("Analysis Data Model:", analysisDataModel);

    const analysis = await analysisDataModel.findOne().sort({ createdAt: -1 }).lean();
    return res.status(200).json({ msg: "Analysis data fetched successfully", analysis });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch claims" });
  }
};


exports.getAnalysisDataForUAEDashboard = async(req,res)=>{
    try{
    const tenantID = req.params.tenantID
    const analysisData = await getAnalysisModelUAE(tenantID);
    const analysis = await analysisData.findOne().sort({createdAt:-1}).lean()
    return res.status(200).json({ msg: "Analysis data fetched successfully",analysis });
    }catch(error){
        return res.status(500).json({ msg: "Failed to fetch analysis for dashboard" });

    }
}