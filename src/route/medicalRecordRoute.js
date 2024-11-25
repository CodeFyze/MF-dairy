import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addMedicalRecord, getMedicalRecord } from "../controller/medicalRecord.controller.js";



const medicalRecordRoute=Router()


medicalRecordRoute.route("/add").post(auth,addMedicalRecord)
medicalRecordRoute.route("/getMonthlyMedicalRecord/:month").get(auth,getMedicalRecord)
export {medicalRecordRoute}