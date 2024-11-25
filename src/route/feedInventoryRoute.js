

import { Router } from "express";

import { auth } from "../middleware/auth.js";
import { addFeed, getFeedInventoryDetails } from "../controller/feedInventory.controller.js";


const feedInventoryRoute=Router()


feedInventoryRoute.route("/feedAmount").get(auth,getFeedInventoryDetails)
feedInventoryRoute.route("/addFeed").put(auth,addFeed)
export {feedInventoryRoute}