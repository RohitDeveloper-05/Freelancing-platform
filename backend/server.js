import expresss from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import dotenv from 'dotenv'

import ConfigureDb from './Config/ConfigureDb.js'

import userRoute from "./App/routes/user.route.js"
import gigRoute from "./App/routes/gig.route.js"
import orderRoute from "./App/routes/order.route.js"
import conversationRoute from "./App/routes/conversation.route.js"
import messageRoute from "./App/routes/message.route.js"
import reviewRoute from "./App/routes/review.route.js"
import authRoute from "./App/routes/auth.route.js"


const app = expresss()
dotenv.config()

ConfigureDb()

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(expresss.json());
app.use(cookieParser());


app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/gigs",gigRoute)
app.use("/api/orders",orderRoute)
app.use("/api/conversations",conversationRoute)
app.use("/api/messages",messageRoute)
app.use("/api/reviews",reviewRoute)

app.use((err,req,res,next) =>{
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).send(errorMessage);
})

app.listen(8800, ()=>{
  console.log("Backend is Running on server number 8800")
})
