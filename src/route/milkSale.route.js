import { Router } from "express";


import { auth } from "../middleware/auth.js";
import { addSaleMilk, deleteMilkSalesRecordbyId, getMonthlyMilkSaleRecord, getSaleMilkByVendorName,updateMilkSaleRecordById } from "../controller/milkSale.controller.js";


const milkSaleRoute=Router()

milkSaleRoute.route("/addSaleMilk").post(auth,addSaleMilk)
milkSaleRoute.route("/getMilkSaleRecordByMonth/:month").get(auth,getMonthlyMilkSaleRecord)
milkSaleRoute.route("/getMilkSaleMonthlyRecordByVendorName/:vendorName").get(auth,getSaleMilkByVendorName)
milkSaleRoute.route("/deleteMilkSaleRecordById/:_id").delete(auth,deleteMilkSalesRecordbyId)
milkSaleRoute.route("/updateMilkSaleRecordById/:_id").patch(auth,updateMilkSaleRecordById)



export {milkSaleRoute}