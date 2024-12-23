import { Cow } from "../models/cow.model.js";
import { DairyFarm } from "../models/dairyForm.js";
import { FeedConsumtion } from "../models/feedConsumtion.model.js";
import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";

const morningFeedConsumtion = async (req, res, next) => {
  const { cowId, date, morning } = req.body;

  if (!cowId || !date || !morning) {
    return next(new ApiError(400, "All Fields are required"));
  }
  const exitsCow = await Cow.findOne({ _id: cowId });
  if (!exitsCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const existsTodayFeedConsumtion = await FeedConsumtion.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: { $gt: 0 } },
    ],
  });

  if (existsTodayFeedConsumtion) {
    return next(
      new ApiError(
        400,
        "Today Feed Consumtion for this cow and date already exists"
      )
    );
  }

  const existsMorningFeedSumtion = await FeedConsumtion.findOne({
    cowId,
    date,
    morning: { $exists: true },
  });

  if (existsMorningFeedSumtion) {
    return next(
      new ApiError(
        400,
        "Morning Feed Consumtion for this cow and date already exists"
      )
    );
  }

  const feedAmount = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
  });
  if (!feedAmount) {
    next(new ApiError(400, "Error Occur while fetching feed amount"));
  }
  if (feedAmount.feedAmount < morning) {
    return next(new ApiError(400, "Not enough feed amount"));
  }

  const morningFeedConsumtion = await FeedConsumtion.create({
    cowId,
    morning,
    date,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req?.user._id,
    total: morning,
    evening: 0,
  });

  if (!morningFeedConsumtion) {
    return next(new ApiError(500, "Error creating morning Feed Consumtion"));
  }

  feedAmount.feedAmount = feedAmount.feedAmount - morning;
  await feedAmount.save();
  res.status(201).json({
    message: "Morning Feed Consumtion created successfully",
    success: true,
    morningFeedConsumtion,
  });
};

const eveningFeedConsumtion = async (req, res, next) => {
  const { cowId, date, evening } = req.body;

  if (!cowId || !date || !evening) {
    return next(new ApiError(400, "All Fields are required"));
  }
  const exitsCow = await Cow.findOne({ _id: cowId });
  if (!exitsCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const existsTodayFeedConsumtion = await FeedConsumtion.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: { $gt: 0 } },
    ],
  });

  if (existsTodayFeedConsumtion) {
    return next(
      new ApiError(
        400,
        "Today Feed Consumtion for this cow and date already exists"
      )
    );
  }

  const existsMorningFeedSumtion = await FeedConsumtion.findOne({
    cowId,
    date,
    morning: { $exists: true },
  });

  if (!existsMorningFeedSumtion) {
    return next(
      new ApiError(400, "Morning  feed consumtion does not exist for this cow")
    );
  }

  const feedAmount = await FeedInventory.findOne({
    dairyFarmId: req.user.dairyFarmId,
  });
  if (!feedAmount) {
    next(new ApiError(400, "Error Occur while fetching feed amount"));
  }
  if (feedAmount.feedAmount < evening) {
    return next(new ApiError(400, "Not enough feed amount"));
  }

  existsMorningFeedSumtion.evening = evening;
  existsMorningFeedSumtion.total = evening + existsMorningFeedSumtion.morning;
  await existsMorningFeedSumtion.save();

  feedAmount.feedAmount = feedAmount.feedAmount - evening;
  await feedAmount.save();
  res.status(201).json({
    message: "evening Feed Consumtion created successfully",
    success: true,
  });
};

const getFeedConsumtionRecordByMonth = async (req, res, next) => {
  let { month } = req.params;

  month = month.slice(0, 3);

  const feedConsumtionRecordMonthly = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date: { $regex: month, $options: "i" } },
          { dairyFarmId: req.user.dairyFarmId },
        ],
      },
    },
    {
      $lookup: {
        from: "cows",
        localField: "cowId",
        foreignField: "_id",
        as: "cow",
      },
    },
    {
      $addFields: {
        cow: { $arrayElemAt: ["$cow", 0] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        cowId: 1,
        morning: 1,
        evening: 1,
        total: 1,
        date: 1,
        createdBy: { name: "$user.name", _id: "$user._id" },
        cow: {
          animalNumber: "$cow.animalNumber",
          _id: "$cow._id",
          image: "$cow.image",
        },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "succesfully get monthly feed consumtion record",
    feedConsumtionRecordMonthly,
  });
};

const getTodayFeedConsumtionRecord = async (req, res, next) => {
  const { date } = req.params;

  const todayFeedConsumtionRecord = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date },
          { dairyFarmId: req.user.dairyFarmId },
          { evening: { $exists: true } },
        ],
      },
    },
    {
      $lookup: {
        from: "cows",
        localField: "cowId",
        foreignField: "_id",
        as: "cow",
      },
    },
    {
      $addFields: {
        cow: { $arrayElemAt: ["$cow", 0] },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $addFields: {
        user: { $arrayElemAt: ["$user", 0] },
      },
    },
    {
      $project: {
        cowId: 1,
        morning: 1,
        evening: 1,
        total: 1,
        date: 1,
        createdBy: { name: "$user.name", _id: "$user._id" },
        cow: {
          animalNumber: "$cow.animalNumber",
          _id: "$cow._id",
          image: "$cow.image",
        },
      },
    },
  ]);

  if (!todayFeedConsumtionRecord) {
    return next(new ApiError(404, "Error while getting Feed Consumtion today record"));
  }

  res.status(200).json({
    success: true,
    message: "succesfully get today Feed Consumtion records",
    todayFeedConsumtionRecord,
  });
};

const getTodayFeedConsumtionCount = async (req, res, next) => {
  const { date } = req.params;
  const todayFeedConsumtionCount = await FeedConsumtion.aggregate([
    {
      $match: {
        $and: [
          { date },
          { dairyFarmId: req.user.dairyFarmId },
          { evening: { $exists: true } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        morning: { $sum: "$morning" },
        evening: { $sum: "$evening" },
      },
    },
  ]);

  res.status(200).json({
    success: true,
    message: "get feed consumtion count of milk records successfully",
    todayFeedConsumtionCount,
  });
};

const updateFeedConsumtionRecordById = async (req, res, next) => {
  const { _id } = req.params;
  const { morning, evening, total } = req.body;

  const existsFeedConsumtionRecord = await FeedConsumtion.findOne({ _id });

  if (!existsFeedConsumtionRecord) {
    return next(new ApiError(404, "Feed Consumtion record not found"));
  }

  existsFeedConsumtionRecord.morning = morning || existsFeedConsumtionRecord.morning;
  existsFeedConsumtionRecord.evening = evening || existsFeedConsumtionRecord.evening;
  existsFeedConsumtionRecord.total = total;
  await existsFeedConsumtionRecord.save();

  res.status(200).json({
    success: true,
    message: "Feed Consumtion record updated successfully",
  });
};

const deleteFeedConsumtionRecord= async (req, res, next) => {
  const { _id } = req.params;
  const deleteFeedConRecord = await FeedConsumtion.deleteOne({ _id });

  if (!deleteFeedConRecord) {
    return next(new ApiError(500, "Error deleting Feed Consumtion record"));
  }

  res.status(200).json({
    success: true,
    message: "Feed Consumtion record deleted successfully",
  });
};

export {
  morningFeedConsumtion,
  eveningFeedConsumtion,
  getFeedConsumtionRecordByMonth,
  getTodayFeedConsumtionRecord,
  getTodayFeedConsumtionCount,
  updateFeedConsumtionRecordById,
  deleteFeedConsumtionRecord
};
