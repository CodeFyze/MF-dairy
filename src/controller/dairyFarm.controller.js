import { DairyFarm } from "../models/dairyForm.js"
import { ApiError } from "../utlis/ApiError.js"
const registerDairyFarm=async(req,res,next) =>{
    const {name,ownerName,location,registrationDate}=req.body

    if([name,ownerName,location,registrationDate].some(item=>item.trim()=="")){
        return next(new ApiError(400,"All fields are required"))
    }
    const exitsDairy=await DairyFarm.findOne({name,ownerName})

    if(exitsDairy){
        return next(new ApiError(400,"This Dairy Form is Already Created"))
    }
    const dairyFarm=await DairyFarm.create({name,ownerName,location,registrationDate})
    
    if(!dairyFarm){
        return next(new ApiError(500,"Error creating Dairy Form"))
    }
    res.status(200).json({success:true,message:"successfully created dairy farm",dairyFarm})

}


const getAllDairyFarms= async(req,res,next) => {
    const dairyFarms=await DairyFarm.find()
    if(!dairyFarms){
        return next(new ApiError(404,"No Dairy Forms found"))
    }
    res.status(200).json({success:true,message:"successfully get all dairyfarm details",dairyFarms})
}
export {registerDairyFarm,getAllDairyFarms}