const getAnalysisModel = require('../model/analysisData')
const {calculateClaimsData} = require('./claimsData') 


exports.getAnalysisData = async(req,res)=>{
    try {
        const tenantID = req.params.tenantID;
        await calculateClaimsData({ params: { tenantID } },res);
        const analysisData = await getAnalysisModel(tenantID);
        //to find all the documents
        // const analysis = await analysisData.find()
        //for getting newly created document as response
        const analysis = await analysisData.findOne()
        .sort({ createdAt: -1 })
        .lean();
        return res.status(200).json({ msg: "Analysis data fetched successfully",analysis });
    } catch (error) {
        return res.status(500).json({ msg: "Failed to fetch claims" });
    }
}


exports.getAnalysisDataForDashboard = async(req,res)=>{
    try{
    const tenantID = req.params.tenantID
    const analysisData = await getAnalysisModel(tenantID);
    const analysis = await analysisData.findOne().sort({createdAt:-1}).lean()
    return res.status(200).json({ msg: "Analysis data fetched successfully",analysis });
    }catch(error){
        return res.status(500).json({ msg: "Failed to fetch analysis for dashboard" });
    }
}