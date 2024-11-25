import mongoose from "mongoose";

const dairyFarmSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  location: { type: String, required: true },
  ownerName: { type: String, required: true },
  AllowAccess: { type: Boolean, default: true },
  registrationDate: { type: String, required: true}
});

export const DairyFarm=mongoose.model('DairyFarm',dairyFarmSchema)
