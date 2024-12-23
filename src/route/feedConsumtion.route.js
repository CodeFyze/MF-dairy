import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { deleteFeedConsumtionRecord, eveningFeedConsumtion, getFeedConsumtionRecordByMonth, getTodayFeedConsumtionCount, getTodayFeedConsumtionRecord, morningFeedConsumtion, updateFeedConsumtionRecordById } from "../controller/feedConsumtion.controller.js";

const feedConsumtionRoute=Router()

feedConsumtionRoute.route("/morningFeed").post(auth,morningFeedConsumtion)
feedConsumtionRoute.route("/eveningFeed").post(auth,eveningFeedConsumtion)
feedConsumtionRoute.route("/getFeedConsumtionRecordByMonth/:month").get(auth,getFeedConsumtionRecordByMonth)
feedConsumtionRoute.route("/getTodayFeedConsumtionRecord/:date").get(auth,getTodayFeedConsumtionRecord)
feedConsumtionRoute.route("/getTodayFeedConsumtionCount/:date").get(auth,getTodayFeedConsumtionCount)
feedConsumtionRoute.route("/updateFeedConsumtionRecordById/:_id").get(auth,updateFeedConsumtionRecordById)
feedConsumtionRoute.route("/deleteFeedConsumtionRecordById/:_id").get(auth,deleteFeedConsumtionRecord)
export {feedConsumtionRoute}