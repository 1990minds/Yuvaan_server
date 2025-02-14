// models/EmployerSettings.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployerRewardsRatio = new Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true, 
    ref: 'employeeUAE',
  },
  rewardToCurrencyRatio: {
    type: Number,
    required: true,
    default: 1,
  },
  country: {
    type: String,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('EmployerRewardRatio', EmployerRewardsRatio);
