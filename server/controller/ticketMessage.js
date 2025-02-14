// controllers/messageController.js

const Message = require('../model/ticketMessage');

exports.getMessages = async (req, res) => {
  const ticketid = req.params.ticketId

  try {
    const messages = await Message.find({ticket_id:ticketid}).sort({ timestamp: 1 });
 
   res.status(201).json({ msg: "Successfully", messages });
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { sender, text, ticket_id } = req.body;
  try {
    const message = new Message({ sender, text ,ticket_id});
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
