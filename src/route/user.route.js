import { Router } from "express";
import { createAdmin, createUser, getMyWorkers, login } from "../controller/user.controller.js";
import {auth} from "../middleware/auth.js"
const userRoute=Router()

userRoute.route("/login").post(login)
userRoute.route("/createUser").post(auth,createUser)
userRoute.route("/createAdmin").post(createAdmin)
userRoute.route("/getMyWorkers").get(auth,getMyWorkers)
export {userRoute}