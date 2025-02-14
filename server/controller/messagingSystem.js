const messagingSytem = require('../model/messagingSytem')




exports.getAllMessage = async (req, res) => {

  const qtnID = req.params.qtnID
    try {
      const messages = await messagingSytem.find({quotation:qtnID}).sort({ createdAt: -1 });

      res.status(201).json({ msg: "Successfully", messages });
    } catch (error) {
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };

exports.getMessagesSupplier = async(req,res)=>{

    const supplier = req.params.supplierID 
    try{

        const message  = await messagingSytem.find({recievedBySupplier:supplier}).sort({createdAt:-1})
       
        return res.status(200).json({ msg: "Success", message});

        
        
    }catch(error){
    
    return res.status(404).json({ msg: "Not Found" });

    }
}



exports.getMessagesEmployer = async(req,res)=>{

    const employer = req.params.employerID 
    try{

        const message  = await messagingSytem.find({recievedByEmployer:employer}).sort({createdAt:-1})
      
        return res.status(200).json({ msg: "Success", message});


    }catch(error){
        
    return res.status(404).json({ msg: "Not Found" });

    }
}


exports.markmessageAsRead = async (req, res) => {

    try {
      const message = await messagingSytem.findById(req.params.id);
  
      if (!message) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      // Use strict equality comparison (===) instead of assignment (=)
      if (req.body.readByAdmin === "true") {
        message.readByAdmin = "true";
      } else if (req.body.readBySupplier === "true") {
        message.readBySupplier = "true";
      }
      else if (req.body.readByEmployer === "true") {
        message.readByEmployer = "true";
      }
       else {
       
        return res.status(400).json({ message: 'Invalid request body' });
      }
  
      await message.save();
  
      res.json({ message: 'Message marked as read' });
    } catch (error) {
      
      res.status(500).json({ message: 'Server Error' });
    }
  };