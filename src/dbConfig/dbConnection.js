import mongoose from "mongoose"


const dbConnection =async()=>{
    try {
       const connection=await mongoose.connect(`${process.env.DB_URL}/dairy-app`) 
       
      console.log("Db Connected")
    } catch (error) {
        console.log("Error: while connecting with database",error)
    }
}
export {dbConnection}