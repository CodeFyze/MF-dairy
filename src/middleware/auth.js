import jwt from "jsonwebtoken";
import {ApiError} from "../utlis/ApiError.js"
import { User } from "../models/user.model.js";
const auth = async (req, res, next) => {
  const token =req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return next(new ApiError(400, "Unauthorized login......"));
  }

 
  try {
    const { _id } = jwt.verify(
      token,
      process.env.JWT_SECRET 
    );
    const user = await User.findOne({_id}).select("-password");
    req.user = user;
   return next();
  } catch (err) {
    return next(new ApiError(400, " Token is not verifed:", err));
  }
};

export { auth };
