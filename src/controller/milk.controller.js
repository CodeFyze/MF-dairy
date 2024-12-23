import { Cow } from "../models/cow.model.js";
import { MilkProduction } from "../models/milkProduction.model.js";
import { ApiError } from "../utlis/ApiError.js";

const morningMilkProduction = async (req, res, next) => {
  const { cowId, date, morning } = req.body;
  if (!cowId || !date || !morning) {
    return next(new ApiError(400, "All Fields are required"));
  }
  const exitsCow = await Cow.findOne({ _id: cowId });
  if (!exitsCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const existsTodayMilkProduction = await MilkProduction.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: { $gt: 0 } },
    ],
  });

  if (existsTodayMilkProduction) {
    return next(
      new ApiError(
        400,
        "Today Milk Production for this cow and date already exists"
      )
    );
  }

  const existsMorningMilkProduction = await MilkProduction.findOne({
    cowId,
    date,
    morning: { $exists: true },
  });

  if (existsMorningMilkProduction) {
    return next(
      new ApiError(
        400,
        "Morning Milk Production for this cow and date already exists"
      )
    );
  }
  const morningMilkProduction = await MilkProduction.create({
    cowId,
    morning,
    date,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req?.user._id,
    total: morning,
    evening: 0,
  });

  if (!morningMilkProduction) {
    return next(new ApiError(500, "Error creating morning milk production"));
  }
  res.status(201).json({
    message: "Morning Milk Production created successfully",
    success: true,
    morningMilkProduction,
  });
};

const eveningMilkProduction = async (req, res, next) => {
  const { cowId, evening, date } = req.body;
  if (!cowId || !date || !evening) {
    return next(new ApiError(400, "All Fields are required"));
  }
  const exitsCow = await Cow.findOne({ _id: cowId });
  if (!exitsCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const existsTodayMilkProduction = await MilkProduction.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { evening: {$gt:0}},
    ],
  });

  if (existsTodayMilkProduction) {
    return next(
      new ApiError(
        400,
        "Today Milk Production for this cow and date already exists"
      )
    );
  }

  const exitsMorningMilkProduction = await MilkProduction.findOne({
    $and: [
      { cowId },
      { date },
      { dairyFarmId: req.user.dairyFarmId },
      { morning: { $exists: true } },
    ],
  });
 
if(!exitsMorningMilkProduction){
  return next(new ApiError(400, "Please first enter morning milk first"));
}
  exitsMorningMilkProduction.evening = evening;
  exitsMorningMilkProduction.total =
    evening + exitsMorningMilkProduction.morning;
  await exitsMorningMilkProduction.save();

  res.status(200).json({
    message: "Evening Milk Production updated successfully",
    success: true,
  });
};

const getMilkProductionRecordyByMonth = async (req, res, next) => {
  let { date } = req.params;

  date = date.slice(0, 3);

  const milkProductionMonthlyRecord = await MilkProduction.aggregate([
    {
      $match: {
        $and: [
          { date: { $regex: date, $options: "i" } },
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
    message: "succesfully get monthly milk production records",
    milkProductionMonthlyRecord,
  });
};

const getTodayMilkProductionRecord = async (req, res, next) => {
  const { date } = req.params;

  const todayMilkRecord = await MilkProduction.aggregate([
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

  if (!todayMilkRecord) {
    return next(new ApiError(404, "Error while getting milk today record"));
  }

  res.status(200).json({
    success: true,
    message: "succesfully get today milk production records",
    todayMilkRecord,
  });
};

const getTodayMilkProductionCount = async (req, res, next) => {
  const { date } = req.params;
  const todayMilkCount = await MilkProduction.aggregate([
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
    message: "get milk count of milk records successfully",
    todayMilkCount,
  });
};

const updateMilkRecordById = async (req, res, next) => {
  const { _id } = req.params;
  const { morning, evening, total } = req.body;

  const existsMilkRecord = await MilkProduction.findOne({ _id });

  if (!existsMilkRecord) {
    return next(new ApiError(404, "Milk record not found"));
  }

  existsMilkRecord.morning = morning || existsMilkRecord.morning;
  existsMilkRecord.evening = evening || existsMilkRecord.evening;
  existsMilkRecord.total = total;
  await existsMilkRecord.save();

  res.status(200).json({
    success: true,
    message: "Milk record updated successfully",
  });
};

const deleteMilkRecordById = async (req, res, next) => {
  const { _id } = req.params;
  const deleteMilkRecord = await MilkProduction.deleteOne({ _id });

  if (!deleteMilkRecord) {
    return next(new ApiError(500, "Error deleting milk record"));
  }

  res.status(200).json({
    success: true,
    message: "Milk record deleted successfully",
  });
};

export {
  morningMilkProduction,
  eveningMilkProduction,
  getMilkProductionRecordyByMonth,
  getTodayMilkProductionRecord,
  getTodayMilkProductionCount,
  updateMilkRecordById,
  deleteMilkRecordById,
};
