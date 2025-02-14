const Notification = require('../model/notification');


exports.getOneNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('quotation').cxec();

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    
    res.status(500).json({ message: 'Server Error' });
  }
};




exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({createdAt:-1}).populate('quotation').populate('supplierOrder').exec();
    res.json(notifications);
  } catch (error) {
 
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.markNotificationAsRead = async (req, res) => {

  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    // Use strict equality comparison (===) instead of assignment (=)
    if (req.body.readStatusbyadm === true) {
      notification.readStatusbyadm = true;
    } else if (req.body.readStatusbysup === true) {
      notification.readStatusbysup = true;
    }
    else if (req.body.readStatusbyemp === true) {
      notification.readStatusbyemp = true;
    }
     else {
     
      return res.status(400).json({ message: 'Invalid request body' });
    }

    await notification.save();

    res.json({ message: 'Notification marked as read' });
  } catch (error) {
   
    res.status(500).json({ message: 'Server Error' });
  }
};

