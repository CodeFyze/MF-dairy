import mongoose from "mongoose";

const milkProductionSchema = mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: "Cow", required: true },
    morning:{type:Number,required: true},
    evening:{type:Number},
    total: { type: Number},
    date:{type:String,required: true},
    dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm",required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required: true}

})

export const MilkProduction=mongoose.model("MilkProduction",milkProductionSchema)