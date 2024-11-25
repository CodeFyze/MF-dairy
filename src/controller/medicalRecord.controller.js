import { Cow } from "../models/cow.model.js";
import { MedicalRecord } from "../models/medicalRecord.model.js";
import { ApiError } from "../utlis/ApiError.js";

const addMedicalRecord = async (req, res, next) => {
  const { date, cowId, vaccineType } = req.body;

  if ([date, cowId, vaccineType].some((item) => item.trim() == "")) {
    return next(new ApiError(400, "All fields are required"));
  }

  const existCow = await Cow.findOne({
    $and: [{ _id: cowId }, { dairyFarmId: req.user.dairyFarmId }],
  });

  if (!existCow) {
    return next(new ApiError(400, "Cow Not Found"));
  }

  const medicalRecord = await MedicalRecord.create({
    date,
    cowId,
    vaccineType,
    dairyFarmId: req.user.dairyFarmId,
    createdBy: req.user._id,
  });

  if (!medicalRecord) {
    return next(new ApiError(400, "Error registering medical record"));
  }

  res.status(200).json({
    success: true,
    message: "medical record successfully added",
    medicalRecord,
  });
};

const getMedicalRecord =  async (req, res, next) => {
    let { month } = req.params;
  
    month = month.slice(0, 3);
  
    const monthlyMedicalRecord = await MedicalRecord.aggregate([
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
         vaccineType:1,
         dairyFarmId:1,
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
    
    if(!monthlyMedicalRecord){
        return next(new ApiError(400,"Error Occur while getting monthly medical records"))
    }

    res.status(200).json({
      success: true,
      message: "Succesfully get monthly medical records",
      monthlyMedicalRecord,
    });
   
  };
  
 export {addMedicalRecord,getMedicalRecord}