import createError from "../utils/createError.js";
import Order from "../models/Order.model.js";
import Gig from "../models/Gig.model.js";
import Stripe from "stripe";

export const intent = async (req,res,next) =>{
  //console.log("Inside Order.controller.js, fn createOrder")
  //console.log("Inside order.controller.js --> fn intent")
  const stripe = new Stripe(process.env.STRIPE);

  try{
    const gig = await Gig.findById(req.params.id);
    //console.log("req.params",req.params.gigId)
    //console.log("gig",gig)

    // console.log("gig_val inside intent",gig)
    // console.log("Gig_Model_Value_",Gig.findById())
    // console.log("Order_Model_Value_",Order.findById())
    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100 ,
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id,
    });
  
    const res_order = await newOrder.save();
    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });

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

export const confirm = async (req, res, next) => {
  try {
    const orders = await Order.findOneAndUpdate(
      {
        payment_intent: req.body.payment_intent,
      },
      {
        $set: {
          isCompleted: true,
        },
      }
    );

    res.status(200).send("Order has been confirmed.");
  } catch (err) {
    next(err);
  }
}