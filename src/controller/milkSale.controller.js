import { MilkSale } from "../models/milkSale.model.js";
import { ApiError } from "../utlis/ApiError.js";

const addSaleMilk = async (req, res, next) => {
  const { vendorName, amount_sold, date, total_payment } = req.body;

  if (!vendorName || !amount_sold || !date || !total_payment) {
    return next(new ApiError(400, "All fields are required"));
  }

  try {
    const milkSale = await MilkSale.create({
      vendorName,
      amount_sold,
      date,
      total_payment,
      dairyFarmId: req.user.dairyFarmId,
    });
    if (!milkSale) {
      return next(new ApiError(500, "Error creating Milk Sale"));
    }
    res.status(201).json({
      success: true,
      message: "Milk Sale created successfully",
      milkSale,
    });
  } catch (error) {
    next(error);
  }
};

const getMonthlyMilkSaleRecord = async (req, res, next) => {
  let { month } = req.params;
  month = month.slice(0, 3);

  try {
    const monthlyMilkRecord = await MilkSale.aggregate([
      {
        $match: {
          $and: [
            { dairyFarmId: req.user.dairyFarmId },
            { date: { $regex: month, $options: "i" } },
          ],
        },
      },
    ]);

    res.json({
      success: true,
      message: "successfully get monthly milk Record",
      monthlyMilkRecord,
    });
  } catch (error) {
    next(error);
  }
};

const getSaleMilkByVendorName = async (req, res, next) => {
  let { vendorName } = req.params;

  try {
    const monthlyMilkRecord = await MilkSale.aggregate([
      {
        $match: {
          $and: [{ dairyFarmId: req.user.dairyFarmId }, { vendorName }],
        },
      },
    ]);

    res.json({
      success: true,
      message: "successfully get monthly milk Record",
      monthlyMilkRecord,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMilkSalesRecordbyId = async (req, res, next) => {
  const { _id } = req.params;

  try {
    const milkSale = await MilkSale.findByIdAndDelete({ _id });
    if (!milkSale) {
      return next(new ApiError(404, "Milk Sale record not found"));
    }
    res.json({
      success: true,
      message: "Milk Sale record deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateMilkSaleRecordById = async (req, res, next) => {
  const { _id } = req.params;

  const { vendorName, amount_sold, date, total_payment } = req.body;
  try {
    const milkSale = await MilkSale.findOne({_id:_id})
   
    if (!milkSale) {
      return next(new ApiError(404, "Milk Sale record not found"));
    }
    milkSale.vendorName = vendorName || milkSale.vendorName;
    milkSale.amount_sold = amount_sold || milkSale.amount_sold;
    milkSale.date = date || milkSale.date;
    milkSale.total_payment = total_payment || milkSale.total_payment;
    await milkSale.save();

    res.json({
      success: true,
      message: "Milk Sale record updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
export {
  addSaleMilk,
  getMonthlyMilkSaleRecord,
  getSaleMilkByVendorName,
  deleteMilkSalesRecordbyId,
  updateMilkSaleRecordById
};
