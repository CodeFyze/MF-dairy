import mongoose from "mongoose";

const feedConsumtionSchema = mongoose.Schema({
    morning:{type:Number,required: true},
    evening:{type:Number},
    total: { type: Number},
    date:{type:String,required: true},
    dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm",required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required: true}
})

export const FeedConsumtion=mongoose.model("FeedConsumtion",feedConsumtionSchema)