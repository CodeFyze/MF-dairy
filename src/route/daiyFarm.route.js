import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { getAllDairyFarms, registerDairyFarm } from "../controller/dairyFarm.controller.js";


const dairyFarmRoute=Router()

dairyFarmRoute.route("/register").post(registerDairyFarm)
dairyFarmRoute.route("/getAllDairyFarms").get(getAllDairyFarms)

export {dairyFarmRoute}