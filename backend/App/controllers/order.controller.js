import createError from "../utils/createError.js";
import Order from "../models/order.model.js";
import Gig from "../models/Gig.model.js";

export const createOrder = async (req,res,next) =>{
  console.log("Inside Order.controller.js, fn createOrder")

  try{
    const gig = await Gig.findById(req.params.gigId);
    //console.log("req.params",req.params.gigId)
    //console.log("gig",gig)

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: "temporary String",
    });
  
    const res_order = await newOrder.save();
    res.status(200).json(res_order)
  }
  catch(err){
    next(err);
  }
}


export const getOrders = async (req,res,next) =>{
  
  try {
    const orders = await Order.find({
      ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
      isCompleted: true,
    });

    res.status(200).send(orders);
  } catch (err) {
    next(err);
  }

}