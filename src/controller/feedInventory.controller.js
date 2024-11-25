import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";

const getFeedInventoryDetails = async (req, res, next) => {
  const feedInventory = await FeedInventory.findOne({
    createdBy: req.user._id,
  });

  if (!feedInventory) {
    return next(new ApiError(404, "Getting feed inventory failed"));
  }

  res.status(200).json({
    message: "Feed inventory retrieved successfully",
    success: true,
    feedInventory,
  });
};

const addFeed = async (req, res, next) => {
  const { feedAmount } = req.body;

  const existsFeedInventory = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
  });

  if (!existsFeedInventory) {
    next(new ApiError(400, "FeedInventory does not exist"));
  }
  existsFeedInventory.feedAmount = feedAmount + existsFeedInventory.feedAmount;
  await existsFeedInventory.save();
  res
    .status(200)
    .json({ success: true, message: "Feed inventory successfully updated" });
};



export { getFeedInventoryDetails, addFeed };
