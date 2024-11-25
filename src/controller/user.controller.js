import { FeedInventory } from "../models/feedInventory.model.js";
import {User} from "../models/user.model.js"
import { ApiError } from "../utlis/ApiError.js";
import jwt from "jsonwebtoken"


const createUser = async (req, res, next) => {
   
   
    const {
        name,
        email,
        password,
    } = req.body;
  
    if (
      [
        name,
        email,
        password,
     
      ].some((item) => item?.trim() == "")
    ) {
      return next(new ApiError(400, "All Feilds are Require"));
    }
 
    const exits = await User.findOne({ email });
  
    if (exits) {
      return  next(new ApiError(400, "This User Already Exits"));
    }
  
    const user = await User.create({
        name,
        email,
        password,
        createdBy:req.user._id,
        dairyFarmId:req.user.dairyFarmId
    });
  
    if (!user) {
      return  next(new ApiError(401, "Error Occur While Creating a User"));
    }
 
  
  


    res.status(200).json({
      message: "Sucessfully user created",
      success: true,
      user: user,
    });
  };
  
const createAdmin = async (req, res, next) => {
   
   
    const {
        name,
        email,
        password,
        dairyFarmId
    } = req.body;
  
    if (
      [
        name,
        email,
        password,
        dairyFarmId
      ].some((item) => item?.trim() == "")
    ) {
      return next(new ApiError(400, "All Feilds are Require"));
    }
 
    const exits = await User.findOne({ email });
  
    if (exits) {
      return  next(new ApiError(400, "This Admin Already Exits"));
    }
  
    const admin = await User.create({
        name,
        email,
        password,
        dairyFarmId,
        role:"Admin"
    });
  
    if (!admin) {
      return  next(new ApiError(401, "Error Occur While Creating a Admin"));
    }
 //create entry into feedInventory 

 const feedInventory=await FeedInventory.create({feedAmount:0,createdBy:admin._id,dairyFarmId})
  
 if (!feedInventory) {
  return next(new ApiError(400, "Error occur while adding feedAmount to feedInventory"));
}


    res.status(200).json({
      message: "Sucessfully Admin created",
      success: true,
      admin
    });
  };

const login = async (req, res, next) => {
   try {
    const { email, password } = req.body;
  
    if ([email, password].some((item) => item.trim() == "")) {
      return next(new ApiError(401, "All fields are require"));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(400, "Incorrect Email"));
    }

    const checkPassword = password == user?.password;

    if (!checkPassword) {
      return next(new ApiError(401, "Password is incorrect......"));
    }
  const JWT_SECRET=process.env.JWT_SECRET
  console.log(JWT_SECRET)
    const user_ = await User.findOne({ email }).select("-password");
    const token = jwt.sign({ _id: user._id }, JWT_SECRET );
  
    res
      .status(200)
      .cookie("token", token, {
        path: "/",
        httpOnly: true,
        sameSite: "None",  
        secure: true,    
      })
      .json({
        user_,
        token,
        message: "Sucessfully login",
        success: true,
      });
   } catch (error) {
    next(error)
   }
  };

const getMyWorkers=async (req,res,next) => {

  const workers = await User.find({ createdBy: req.user._id });
  if(!workers) {
    return next(new ApiError(404, "Getting workers failed"));
  }
  res.status(200).json({
    message: "Workers retrieved successfully",
    success: true,
     workers,
  });
} 
export {createUser,login,createAdmin,getMyWorkers}