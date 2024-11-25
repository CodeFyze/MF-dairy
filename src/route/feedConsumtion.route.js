import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { eveningFeedConsumtion, getFeedConsumtion, morningFeedConsumtion } from "../controller/feedConsumtion.controller.js";

const feedConsumtionRoute=Router()

feedConsumtionRoute.route("/morningFeed").post(auth,morningFeedConsumtion)
feedConsumtionRoute.route("/eveningFeed").post(auth,eveningFeedConsumtion)
feedConsumtionRoute.route("/getFeedConsumtionRecordByMonth/:month").get(auth,getFeedConsumtion)
export {feedConsumtionRoute}