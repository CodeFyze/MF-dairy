import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { deleteMilkRecordById, eveningMilkProduction, getMilkProductionRecordyByMonth, getTodayMilkProductionCount, getTodayMilkProductionRecord, morningMilkProduction, updateMilkRecordById } from "../controller/milk.controller.js";


const milkProductionRoute=Router()

milkProductionRoute.route("/morningMilkProduction").post(auth,morningMilkProduction)
milkProductionRoute.route("/eveningMilkProduction").post(auth,eveningMilkProduction)
milkProductionRoute.route("/getMilkRecordByMonth/:date").get(auth,getMilkProductionRecordyByMonth)
milkProductionRoute.route("/getMilkRecordByDate/:date").get(auth,getTodayMilkProductionRecord)
milkProductionRoute.route("/getMilkCountRecordByDate/:date").get(auth,getTodayMilkProductionCount)
milkProductionRoute.route("/updateMilkRecordById/:_id").patch(auth,updateMilkRecordById)
milkProductionRoute.route("/deleteMilkRecordById/:_id").delete(auth,deleteMilkRecordById)
export {milkProductionRoute}