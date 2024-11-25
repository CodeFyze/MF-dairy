import { Router } from "express";

import { upload } from "../middleware/multer.js";
import { auth } from "../middleware/auth.js";
import { getCows, registerCow } from "../controller/cow.controller.js";
const cowRoute=Router()

cowRoute.route("/register").post(upload.single("image"),auth,registerCow)
cowRoute.route("/getCows").get(auth,getCows)

export {cowRoute}