import mongoose from "mongoose";

const cowSchema = new mongoose.Schema({
  animalNumber: { type: Number, required: true },
  image: { type: String, required:true },
  age: { type: Number, required: true },
  pregnancyStatus: { type: String ,default:true},
  breed: { type: String, required:true},
  dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm",required:true},
  createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});

export const Cow = mongoose.model("Cow", cowSchema);
