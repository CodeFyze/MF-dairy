import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

          
cloudinary.config({ 
  cloud_name:'dd42y8may',
  api_key:'757745346684952',
  api_secret:'J8ulT4U67d7cAJEYoBLhpiLiNnQ' 
});



const cloudinaryUpload=async function(imagePath){
    if(!imagePath)  return null
try {
    const response=await cloudinary.uploader.upload(imagePath,{
       resource_type:'auto',timeout:60000
    })
    fs.unlinkSync(imagePath)
    return response
} catch (error) {
    fs.unlinkSync(imagePath)
    console.log("While upoading the image on cloudinary",error)
}
}

export {cloudinaryUpload}