import mongoose from "mongoose";

const medicalRecordSchema =mongoose.Schema({
    cowId: { type: mongoose.Schema.Types.ObjectId, ref: "Cow", required: true },
    date: { type: String, required: true },
    vaccineType: { type: String, required: true},
    dairyFarmId:{type:mongoose.Schema.Types.ObjectId,ref:"DairyFarm",required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User", required: true}
 });

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);