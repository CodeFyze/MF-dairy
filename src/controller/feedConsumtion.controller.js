
import { Cow } from "../models/cow.model.js";
import { DairyFarm } from "../models/dairyForm.js";
import { FeedConsumtion } from "../models/feedConsumtion.model.js";
import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";
const morningFeedConsumtion=async (req,res,next) => {
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

  const feedAmount=await FeedInventory.findOne({dairyFarmId:req.user.dairyFarmId}) 
  if(!feedAmount) {
   next(new ApiError(400,"Error Occur while fetching feed amount"))
  }
   if(feedAmount.feedAmount<morning){
   return next(new ApiError(400,"Not enough feed amount"))
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
 
  feedAmount.feedAmount=feedAmount.feedAmount -morning
 await feedAmount.save()
  res.status(201).json({
    message: "Morning Feed Consumtion created successfully",
    success: true,
    morningFeedConsumtion,
  });
}

const eveningFeedConsumtion=async (req,res,next) => {
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
   new ApiError(
     400,
     "Morning  feed consumtion does not exist for this cow"
   )
 );
}

    const feedAmount=await FeedInventory.findOne({dairyFarmId:req.user.dairyFarmId}) 
    if(!feedAmount) {
     next(new ApiError(400,"Error Occur while fetching feed amount"))
    }
     if(feedAmount.feedAmount<evening){
     return next(new ApiError(400,"Not enough feed amount"))
     }


    
     existsMorningFeedSumtion.evening= evening
     existsMorningFeedSumtion.total=evening +existsMorningFeedSumtion.morning
    await existsMorningFeedSumtion.save()
  

    feedAmount.feedAmount=feedAmount.feedAmount -evening
   await feedAmount.save()
    res.status(201).json({
        message: "evening Feed Consumtion created successfully",
        success: true,

    })
}

const getFeedConsumtion = async (req, res,next) => {
    let { month } = req.params;

    month = month.slice(0, 3);
  
    const feedConsumtion = await FeedConsumtion.aggregate([
        {
          $match: {
            $and: [
              { date: { $regex: month, $options: "i" } },
              { dairyFarmId: req.user.dairyFarmId },
              {evening:{$exists:true}}
            ],
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
          $project:{
            morning:1,
            evening:1,
            total:1,
            date:1,
            createdBy:{name:"$user.name",_id:"$user._id"},
          }
        }
      ]);
  res.status(200).json({
    message: "Feed Consumtion retrieved successfully",
    success: true,
    feedConsumtion,
  });


  }

export {morningFeedConsumtion,eveningFeedConsumtion,getFeedConsumtion}