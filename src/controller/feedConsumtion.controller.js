
import { DairyFarm } from "../models/dairyForm.js";
import { FeedConsumtion } from "../models/feedConsumtion.model.js";
import { FeedInventory } from "../models/feedInventory.model.js";
import { ApiError } from "../utlis/ApiError.js";
const morningFeedConsumtion=async (req,res,next) => {
    const {
        date,
        morning
    } = req.body;
    if (!date || !morning) {
        return next(new ApiError(400, "All Fields are required"));
    }
   
    const exitsFeed = await FeedConsumtion.findOne({$and:[{date},{dairyFarmId:req.user.dairyFarmId},{evening:{$exists:true}}]})
    if (exitsFeed) {
        return next(new ApiError(400, "Feed Consumtion for this dairyFarm and date already exists"));
    }

const exitsFeedMorning = await FeedConsumtion.findOne({$and:[{date},{dairyFarmId:req.user.dairyFarmId},{morning:{$exists:true}}]})
    if (exitsFeedMorning) {
        return next(new ApiError(400, "Morning Feed Consumtion for dairyFarm and date already exists"));
    }

  const feedAmount=await FeedInventory.findOne({dairyFarmId:req.user.dairyFarmId}) 
   if(!feedAmount) {
    next(new ApiError(400,"Error Occur while fetching feed amount"))
   }
    if(feedAmount.feedAmount<morning){
    return next(new ApiError(400,"Not enough feed amount"))
    }

    const feedConsumtion = await FeedConsumtion.create({morning,date,dairyFarmId:req.user.dairyFarmId,createdBy:req?.user._id})
  
    if(!feedConsumtion){
        return next(new ApiError(500, "Error creating Morning Feed Consumtion"));
    }
  feedAmount.feedAmount=feedAmount.feedAmount -morning
  feedAmount.save()
    res.status(201).json({
        message: "Morning Feed Consumtion created successfully",
        success: true,
        feedConsumtion
    })
}

const eveningFeedConsumtion=async (req,res,next) => {
    const {
        evening,
        date
    } = req.body;
    if (  !date||  !evening) {
        return next(new ApiError(400, "All Fields are required"));
    }
   
    const exitsFeed = await FeedConsumtion.findOne({$and:[{dairyFarmId:req.user.dairyFarmId},{date},{evening:{$exists:true}}]})
   
    if (exitsFeed) {
        return next(new ApiError(400, "Feed Consumtion for this dairyfarm and date already exists"));
    }

    const feedAmount=await FeedInventory.findOne({dairyFarmId:req.user.dairyFarmId}) 
    if(!feedAmount) {
     next(new ApiError(400,"Error Occur while fetching feed amount"))
    }
     if(feedAmount.feedAmount<evening){
     return next(new ApiError(400,"Not enough feed amount"))
     }

const exitsFeedMorning = await FeedConsumtion.findOne({$and:[{date},{dairyFarmId:req.user.dairyFarmId},{morning:{$exists:true}}]})
    
    exitsFeedMorning.evening= evening
    exitsFeedMorning.total=evening +exitsFeedMorning.morning
    await exitsFeedMorning.save()
  

    feedAmount.feedAmount=feedAmount.feedAmount -evening
    feedAmount.save()
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