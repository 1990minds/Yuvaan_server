const ticketsManagement = require('../model/ticketManagement');
const { customAlphabet } = require("nanoid");
const sgMail = require('@sendgrid/mail');

const nanoid = customAlphabet("ABCDEFGHGHIJKLMNOPQRSTUVWXYZ1234567890", 6);


exports.createTicket = async(req,res)=>{

    try{

    const ticket = new ticketsManagement()
    ticket.employerEmail = req.body.employerEmail;
    ticket.employerName = req.body.employerName;

    ticket.employerID = req.body.employerID;
    ticket.ticketID = `Ticket_${nanoid()}`;
    ticket.Subject = req.body.Subject;
    ticket.Description = req.body.Description;
    ticket.Category = req.body.Category;
    ticket.Priority = req.body.Priority;
    ticket.Attachments = req.body.Attachments || "No Attachements";
  

  // Embed the initial message into the ticket's messages array
  // ticket.messages.push(initialMessage);

    await ticket.save()
    sgMail.setApiKey(process?.env?.SENDGRID_API_KEY);

 


//     const msgToEmployer = {
//         to: req?.body?.employerEmail,
//         from: "corporate.solutions@rjac.co.in",
//         subject: `Ticket Confirmation: ${req?.body?.Subject}`,
//         html: `<p>Hi ${req?.body?.employerName},</p>
//                <p>Your ticket has been raised successfully with the following details:</p>
//                <ul>
//                    <li><b>Ticket ID:</b> ${ticket?.ticketID}</li>
//                    <li><b>Subject:</b> ${req?.body?.Subject}</li>
//                    <li><b>Description:</b> ${req?.body?.Description}</li>
//                    <li><b>Category:</b> ${req?.body?.Category}</li>
//                    <li><b>Priority:</b> ${req?.body?.Priority}</li>
//                </ul>
//                <p>We will update you as soon as there is any progress on your ticket. Please refer to your ticket ID for any future correspondence.</p>
//                <p>Thank you,</p>
//                <p>The Total Connect Team</p>`,
//     };


//     const msgToAdmin = {
//         to: "corporate.solutions@rjac.co.in",
//         from: "corporate.solutions@rjac.co.in",
//         subject: `New Ticket Raised by ${req?.body?.employerID}: ${req?.body?.Subject}`,
//         html: `<p>Hi Admin,</p>
//                <p>A new ticket has been raised by <b>${req?.body?.employerName}</b> with the following details:</p>
//                <ul>
//                    <li><b>Ticket ID:</b> ${ticket?.ticketID}</li>
//                    <li><b>Subject:</b> ${req?.body?.Subject}</li>
//                    <li><b>Description:</b> ${req?.body?.Description}</li>
//                    <li><b>Category:</b> ${req?.body?.Category}</li>
//                    <li><b>Priority:</b> ${req?.body?.Priority}</li>
//                    <li><b>Employer Email:</b> ${req?.body?.employerEmail}</li>
//                </ul>
//                <p>Please follow up on this ticket and update the status accordingly.</p>
//                <p>Thank you,</p>
//                <p>The Total Connect Team</p>`,
//     };
// await sgMail.send(msgToEmployer);
//         await sgMail.send(msgToAdmin);    
    
    return res.status(201).json({ msg: "Ticket raised successfully.",ticket });
    


    }catch(error){
     
        return res.status(401).json({ msg: "Something went wrong" });

    }
}




exports.getAllTickets = async (req, res) => {
    try {
      const ticket = await ticketsManagement.find({}).sort({ createdAt: -1 });
  
      res.status(201).json({ msg: "Successfully", ticket });
    } catch (error) {
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };




  exports.getAllTicketsForEmployer = async (req, res) => {

    const employerid = req.params.employerId
    try {
      const ticket = await ticketsManagement.find({employerID:employerid}).sort({ createdAt: -1 });
  
      res.status(201).json({ msg: "Successfully", ticket });
    } catch (error) {
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };



  exports.getOneTicket = async (req, res) => {
    try {
      const ticket = await ticketsManagement.findById(req.params.id);
      res.status(201).json({ msg: "Successfully", ticket });
    } catch (error) {
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };


  exports.updateTicket = async (req, res) => {
  
    try {
      const ticket = await ticketsManagement.findById(req.params.id);
  
      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
    }
      // await ticketsManagement.updateOne({ _id: req.params.id }, req.body);
      if (req.body.ticketStatus) {
        ticket.ticketStatus = req.body.ticketStatus;
      }
     // Create a new message object
     if (req.body.message) {
      const newMessage = {
          sender: req.body.sender || 'system',
          text: req.body.message,
          timestamp: new Date()
      };
      // Add the new message to the ticket's messages array
      ticket.messages.push(newMessage);
  }
  
      await ticket.save();
  
      res.status(201).json({ msg: "Ticket Updated Successfully" ,ticket});
    } catch (error) {
      console.log(error);
      res.status(401).json({ msg: "Something went wrong !", error });
    }
  };





  exports.deleteTicket = async (req, res) => {
    try {
      const ticket = await ticketsManagement.findByIdAndDelete({ _id: req.params.id });
  
      res.status(201).json({ msg: "Deleted Successfully", ticket });
    } catch (error) {
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };
  


