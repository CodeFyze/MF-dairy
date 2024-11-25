import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type:String,default:"Employee"},
  monthly_salary:{type:Number},
  advance_taken:{type:Number},
  registration:{type:String,default:new Date().toDateString()},
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
  dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm"},
 
});

export const User = mongoose.model("User", userSchema);
