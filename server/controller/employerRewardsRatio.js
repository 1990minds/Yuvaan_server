// controllers/employerSettingsController.js
const EmployerSettings = require('../model/employerRewardsRatio');

// Fetch reward settings by employerId
exports.getEmployerSettings = async (req, res) => {
  try {
    const { employerId } = req.params;
    const settings = await EmployerSettings.findOne({ employerId });
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create or update reward settings for an employer
exports.saveOrUpdateEmployerSettings = async (req, res) => {
  try {
    const { employerId } = req.params;
    const { rewardToCurrencyRatio, country, currency } = req.body;

    // Upsert: Update if exists, otherwise create a new entry
    const settings = await EmployerSettings.findOneAndUpdate(
      { employerId },
      { rewardToCurrencyRatio, country, currency },
      { new: true, upsert: true }
    );

    res.status(200).json({ message: 'Settings saved successfully', settings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
