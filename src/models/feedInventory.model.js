import mongoose from "mongoose";

const feedInventorySchema = mongoose.Schema({
  
    feedAmount: { type: Number,required: true },
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required: true},
    dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairFarm"},
})

export const FeedInventory=mongoose.model("FeedInventory",feedInventorySchema)