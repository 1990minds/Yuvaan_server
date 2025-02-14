const getDocumentModel = require("../model/documentCenter")


exports.createDocumentcenter = async (req, res) =>{
      
    const tenantID = req.params.tenantID
try{

    const DocumentCenter = await getDocumentModel(tenantID)
    const documentCenter = new DocumentCenter({...req.body,tenant_id:tenantID});
    await documentCenter?.save();
    return res.status(201).json({msg:"Document created successfully.",documentCenter})
} catch(error){
    console.log(error)
    res.status(500).json({ msg: "Something went wrong." });
}
}


exports.getAllDocuments = async (req, res) =>{
    const tenantID = req?.params?.tenantID
    try{

        const DocumentCenter = await getDocumentModel(tenantID)
        const documentCenter = await DocumentCenter.find().sort({createdAt:-1})
        return res.status(200).json({msg:"sucess",documentCenter})
    }
    catch(error){
        console.log(error)
    return res.status(500).json({ msg: "Something Went Wrong" });
    }
}

    // //delete
    exports.deleteDoc = async (req, res) => {
        const { tenantId, docId } = req.params;
      
        try {
          const DocumentCenter = await getDocumentModel(tenantId);
          const document = await DocumentCenter.findOneAndDelete({
            tenant_id: tenantId,
            _id: docId,
          });
      
          if (!document) {
            return res.status(404).json({ msg: "Document not found" });
          }
      
          res.status(200).json({ msg: "Document deleted successfully", document });
        } catch (error) {
          console.error(error);
          res.status(500).json({ err: "Something went wrong", error });
        }
      };