import { ApiError } from "../utlis/ApiError.js";
import { cloudinaryUpload} from "../utlis/cloudinary.js";
import { Cow } from "../models/cow.model.js";
const registerCow = async (req, res, next) => {
  const { animalNumber, age, breed } = req.body;

  if (breed.trim()=="") {
    return next(new ApiError(400, "All Fields are required"));
  }

  const exitsCow = await Cow.findOne({$and: [{ animalNumber},{dairyFarmId:req.user.dairyFarmId}]})


   if(exitsCow){
    return next(new ApiError(400, "This Cow is Already Created"));
   }

  const imagePath=req.file?.path
  
  if(!imagePath) {
    return next(new ApiError(400, "Image is required"));
  }

  const cloudinaryImagePath=await cloudinaryUpload(imagePath)
  

  if(!cloudinaryImagePath){
    return next(new ApiError(500, "Error uploading image to cloudinary"));
  }

  const cow = await Cow.create({
    animalNumber,
    age,
    breed,
    image:  cloudinaryImagePath?.url || "",
    createdBy: req.user._id,
    dairyFarmId:req.user.dairyFarmId
  });


  if(!cow){
    return next(new ApiError(500, "Error registering cow"));
  }


  res.status(201).json({
    message: "Cow registered successfully",
    success: true,
  });

};


const getCows = async (req, res, next) => {
  const cows = await Cow.find({ dairyFarmId:req.user.dairyFarmId });
  if(!cows) {
    return next(new ApiError(404, "Getting cow failed"));
  }

  res.status(200).json({
    message: "Cows retrieved successfully",
    success: true,
     cows,
  });
}
export { registerCow,getCows };
