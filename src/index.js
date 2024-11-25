
import { app } from "./app.js";
import { dbConnection } from "./dbConfig/dbConnection.js";
import {errorMiddleware} from "./middleware/errorMiddleware.js"
import http from "http"
app.get("/",(req,res)=>{
    res.json({success:true,message:"successfully project is running"})
})

app.use(errorMiddleware)
const server =http.createServer(app)
server.setTimeout(300000)
dbConnection().then(res=>{

    server.listen(process.env.PORT,()=>{
        console.log("Server is running on PORT :",process.env.PORT)
    })

    
}).catch(err=>{
    console.log("Error Occur while connecting to database")
})
