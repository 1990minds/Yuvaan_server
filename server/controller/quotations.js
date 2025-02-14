const Quotations = require('../model/quotations')
const Supplier = require('../model/supplier');
const Products = require('../model/product');
const Notification = require('../model/notification');
const getEmployerModel = require('../model/employer');
const getEmployerQuotationModel = require('../model/employerQuotations');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet("ABCDEFGHGHIJKLMNOPQRSTUVWXYZ1234567890", 3);
const messaging = require('../model/messagingSytem')


exports.generateQuotation = async(req,res)=>{
    console.log(req.body);
    try {
        const Employer = await getEmployerModel();
        const employer = await Employer.findById(req.body.employer);

        const employerQuotations = await getEmployerQuotationModel(employer?.tenant_id);

        const quotes = new employerQuotations();
        quotes.employer = employer;
        const supplier = await Supplier.findById(req.body.supplier);
      
        const products = await Products.findById(req.body.product);
       
        const quotations = new Quotations();
        quotations.quotation_id = `QUOTATION_${nanoid()}`;
        quotations.employer = employer;
        quotations.supplier = supplier;
        quotations.product = products;
        quotations.prices = req.body.prices;
        quotations.additional = req.body.additional;
        quotations.quantities = req.body.quantities;
        quotations.names = req.body.names;
        quotations.product_name = products?.product_name;
        quotations.quotation_status = req.body.quotation_status;
        quotations.employer_files = req?.body?.employer_files;
        quotations.supplier_files = {
            supfile_1: req?.body?.supplier_files?.supfile_1 || "supFile 1",
            supfil_1Name: req?.body?.supplier_files?.supfil_1Name || "supFile 1 name",
        };
        
       

        // Create notification if quotation status is 'quotation created'
        if (quotations.quotation_status === 'Quotation Created') {
            const notification = new Notification({
                quotation: quotations?._id,
                message: `A New Quotation has been created by: ${quotations?.employer?.employer_name}`,
                messageby:"Employer 1st time"
            });
            await notification.save();
        }

        await quotations.save();

        quotes.generated_quotation = quotations;
        await quotes.save();
        return res.status(201).json({ msg: "Quotation Generated Successfully" });
    } catch(error) {
        console.log(error);
        return res.status(401).json({ msg: "Something went wrong" });
    }
};




// exports.updateQuotation = async (req, res) => {


//     try {
//         const quotationId = req.params.quotationId;

//         // Find the existing quotation
//         const quotation = await Quotations.findById(quotationId).populate("employer").exec()

//         console.log(quotation?.employer)
//         console.log(quotation?.employer_files)



//         if (!quotation) {
//             return res.status(404).json({ msg: "Quotation not found" });
//         }

//         // Log the received request body
//         console.log("Request Body:", req.body);

//         if (req.body.employer_files) {
//             quotation.employer_files = req.body.employer_files;
//         }

//         // quotation.employer_files =quotation?.employer_files

//          // Update the quotation status if provided in the request body
//          if (req.body.quotation_status) {
//             quotation.quotation_status = req?.body?.quotation_status;
//         }
//          // reason for rejections
//          if ( req.body.quotation_status == "Quotation Rejected") {
//             quotation.reject_reason = req?.body?.reject_reason;
//           }
         

//         if (
//             (req.body.admin_files && req.body.quotation_status === "Analysis Sent") ||
//             req.body.quotation_status === "Approve Quotation"
//           ) {
//             quotation.admin_files = {
//               ...quotation.admin_files,
//               admin_1: req.body.admin_files.admin_1 || quotation.admin_files.admin_1 || "adminFile 1",
//               admin_1Name: req.body.admin_files.admin_1Name || quotation.admin_files.admin_1Name || "adminFile 1 name",
//               admin_2: req.body.admin_files.admin_2 || quotation.admin_files.admin_2 || "adminFile 2",
//               admin_2Name: req.body.admin_files.admin_2Name || quotation.admin_files.admin_2Name || "adminFile 2 name",
//               approve_text:req?.body?.admin_files?.approve_text || quotation.admin_files.approve_text || "-"
//             };
//           }
          

//         // Update the supplier files in the quotation only if provided in the request body
//         if (req.body.supplier_files) {
//             quotation.supplier_files = {
//                 ...quotation.supplier_files,
//                 supfile_1: req?.body?.supplier_files?.supfile_1 || quotation.supplier_files?.supfile_1 || "supFile 1",
//                 supfil_1Name: req?.body?.supplier_files?.supfil_1Name || quotation.supplier_files?.supfil_1Name || "supFile 1 name",
//             };
//         }

//            // Create notification if quotation status is 'quotation created'
//            if (quotation.quotation_status === 'Quotation Requested') {
//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: `Necessary Documents has been uploaded by ${quotation?.employer?.employer_name}, Please perform the Data Analysis`,
//                 messageby:"Employer 2st time"
//             });
//             await notification.save();
//         }
//         else if (quotation.quotation_status === 'Analysis Sent'){

//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: `Analysis report for ${quotation?.quotation_id} for ${quotation?.employer?.employer_name} has been sent. Please provide the Quotations`,
//                 messageby:"Admin 1st time"

//             });
//             await notification.save();
//         }
//         else if (quotation.quotation_status === 'Quotation Sent'){

//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: ` A Quotation has been sent for review for Quotation ID : ${quotation?.quotation_id}.`,
//                 messageby:"Supplier 1st time"

//             });
//             await notification.save();
//         }
//         else if (quotation.quotation_status === 'Approve Quotation'){

//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: `Quotation has been created by: ${quotation?.employer?.employer_name}, and the analysis report has been approved.`,
//                 messageby:"Admin 2st time"

//             });
//             await notification.save();
//         }
//         else if (quotation.quotation_status === 'Quotation Accepted'){

//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: `Congratulations, your Quotation has been accepted by: ${quotation?.employer?.employer_name} Please connect with the Customer`,
//                 messageby:"Employer 3st time"

//             });
//             await notification.save();
//         }
//         else if (quotation.quotation_status === 'Quotation Rejected'){

//             const notification = new Notification({
//                 quotation: quotation?._id,
//                 message: `We are Sorry, Your Quotation ${quotation?.quotation_id} has been rejected by: ${quotation?.employer?.employer_name}. Better Luck next time.`,
//                 messageby:"Employer 4st time"

//             });
//             await notification.save();
//         }

         


//         // Log the updated quotation object before saving
//         console.log("Updated Quotation:", quotation);

//        const messagingSystem = new messaging({
//         fromAdmin : req.body.fromAdmin,
//         fromSupplier:req.body.fromSupplier,
//         fromEmployer:req.body.fromEmployer,
        
//         recievedByAdmin:req.body.recievedByAdmin,
//         recievedBySupplier:req.body.recievedBySupplier,
//         recievedByEmployer:req.body.recievedByEmployer,
//         // readByAdmin:req.body.fromAdmin,
//         // readBySupplier:quotation?.supplier?._id,
//         // recievedByEmployer:quotation?.employer?._id,



//         messageContent:req.body.messageContent,
//         quotation:quotation?._id




//        })
//        await messagingSystem.save()



//         // Save the updated quotation
//         await quotation.save();

//         // Fetch the updated quotation from the database
//         const updatedQuotation = await Quotations.findById(quotationId);

//         return res.status(200).json({ msg: "Quotation updated successfully", quotation: updatedQuotation });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ msg: "Something went wrong" });
//     }
// }


exports.updateQuotation = async (req, res) => {
    try {
        const quotationId = req.params.quotationId;

        // Find the existing quotation
        const quotation = await Quotations.findById(quotationId).populate("employer").exec();

        if (!quotation) {
            return res.status(404).json({ msg: "Quotation not found" });
        }


        if (req.body.employer_files) {
            quotation.employer_files = req.body.employer_files;
        }

        // Update the quotation status if provided in the request body
        if (req.body.quotation_status) {
            quotation.quotation_status = req.body.quotation_status;
        }

        // Reason for rejections
        if (req.body.quotation_status == "Quotation Rejected") {
            quotation.reject_reason = req.body.reject_reason;
        }

        if (
            (req.body.admin_files && req.body.quotation_status === "Analysis Sent") ||
            req.body.quotation_status === "Approve Quotation"
        ) {
            quotation.admin_files = {
                ...quotation.admin_files,
                admin_1: req.body.admin_files.admin_1 || quotation.admin_files.admin_1 || "adminFile 1",
                admin_1Name: req.body.admin_files.admin_1Name || quotation.admin_files.admin_1Name || "adminFile 1 name",
                admin_2: req.body.admin_files.admin_2 || quotation.admin_files.admin_2 || "adminFile 2",
                admin_2Name: req.body.admin_files.admin_2Name || quotation.admin_files.admin_2Name || "adminFile 2 name",
                approve_text: req.body.admin_files.approve_text || quotation.admin_files.approve_text || "-"
            };
        }

        // Update the supplier files in the quotation only if provided in the request body
        if (req.body.supplier_files) {
            quotation.supplier_files = {
                ...quotation.supplier_files,
                supfile_1: req.body.supplier_files.supfile_1 || quotation.supplier_files.supfile_1 || "supFile 1",
                supfil_1Name: req.body.supplier_files.supfil_1Name || quotation.supplier_files.supfil_1Name || "supFile 1 name",
            };
        }

        // Create a notification based on the quotation status, but only if it's not a message-only operation
        if (!req.body.messageContent) {
            if (quotation.quotation_status === 'Quotation Requested') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `Necessary Documents have been uploaded by ${quotation.employer.employer_name}, Please perform the Data Analysis`,
                    messageby: "Employer 1st time"
                });
                await notification.save();
            } else if (quotation.quotation_status === 'Analysis Sent') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `Analysis report for ${quotation.quotation_id} for ${quotation.employer.employer_name} has been sent. Please provide the Quotations`,
                    messageby: "Admin 1st time"
                });
                await notification.save();
            } else if (quotation.quotation_status === 'Quotation Sent') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `A Quotation has been sent for review for Quotation ID: ${quotation.quotation_id}.`,
                    messageby: "Supplier 1st time"
                });
                await notification.save();
            } else if (quotation.quotation_status === 'Approve Quotation') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `Quotation has been created by: ${quotation.employer.employer_name}, and the analysis report has been approved.`,
                    messageby: "Admin 2nd time"
                });
                await notification.save();
            } else if (quotation.quotation_status === 'Quotation Accepted') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `Congratulations, your Quotation has been accepted by: ${quotation.employer.employer_name} Please connect with the Customer`,
                    messageby: "Employer 3rd time"
                });
                await notification.save();
            } else if (quotation.quotation_status === 'Quotation Rejected') {
                const notification = new Notification({
                    quotation: quotation._id,
                    message: `We are Sorry, Your Quotation ${quotation.quotation_id} has been rejected by: ${quotation.employer.employer_name}. Better Luck next time.`,
                    messageby: "Employer 4th time"
                });
                await notification.save();
            }
        }

   

        if (req.body.messageContent) {
            const messagingSystem = new messaging({
                fromAdmin: req.body.fromAdmin,
                fromSupplier: req.body.fromSupplier,
                fromEmployer: req.body.fromEmployer,
                recievedByAdmin: req.body.recievedByAdmin,
                recievedBySupplier: req.body.recievedBySupplier,
                recievedByEmployer: req.body.recievedByEmployer,
                messageContent: req.body.messageContent,
                quotation: quotation._id
            });
            await messagingSystem.save();
        }

        // Save the updated quotation
        await quotation.save();

        // Fetch the updated quotation from the database
        const updatedQuotation = await Quotations.findById(quotationId);

        return res.status(200).json({ msg: "Quotation updated successfully", quotation: updatedQuotation });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};




exports.getQuotationsBySupplier = async(req,res)=>{

    const supplierID = req.params.id;
    try{
        const quotations = await Quotations.find({supplier:supplierID}).sort({createdAt: -1});
    
        return res.status(200).json({ msg: "Success", quotations});


    }catch(error){  
        console.log(error);
    return res.status(500).json({ msg: "Something Went Wrong" });

    
    }        
}



exports.getAllQuotations = async (req, res) => {
    try {
        // Fetch all quotations
        const quotations = await Quotations.find().sort({createdAt: -1}).populate("product").exec()

        // Check if there are no quotations
        if (!quotations) {
            return res.status(404).json({ msg: "No quotations found" });
        }

        // Return the quotations
        return res.status(200).json({ msg: "Success", quotations });
    } catch (error) {
  
        return res.status(500).json({ msg: "Something went wrong" });
    }
}

exports.fetchOneQuotation = async (req, res) => {
    try {
        const { quotationId } = req.params;

        // Fetch the quotation from the database by ID
        const quotation = await Quotations.findById(quotationId).populate("employer").populate("supplier").populate("product").exec()

        // Check if the quotation exists
        if (!quotation) {
            return res.status(404).json({ msg: "Quotation not found" });
        }

        // If the quotation exists, return it as a response
        return res.status(200).json({ msg: "Quotation found", quotation });
    } catch (error) {
 
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

exports.getQuotationsByEmployer = async(req,res)=>{

    const employerID = req.params.id;
  
    try{
        const quotations = await Quotations.find({employer:employerID}).sort({createdAt: -1});
    
        return res.status(200).json({ msg: "Success", quotations});


    }catch(error){  
  
    return res.status(500).json({ msg: "Something Went Wrong" });

    }        
}
