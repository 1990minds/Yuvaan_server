

const getRewardModel = require('../model/rewards')




//create

exports.createReward = async (req, res) => {
  try {
    const Reward = await getRewardModel(req.body.tenant_id)
    const reward = new Reward();
    await reward.save();
    return res.status(201).json({ msg: "created", reward });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ msg: 'Something went wrong.' });
  }
};



