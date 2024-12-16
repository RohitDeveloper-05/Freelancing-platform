import User from "../models/User.model.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import createError from "../utils/createError.js"
import sendMail from '../utils/nodemailer.js'

export const register = async (req,res,next) =>{
 // console.log('register fn is getting called')
  try{
    const salt = bcryptjs.genSaltSync()
    const hash = bcryptjs.hashSync(req.body.password,salt)
    const newUser = new User({
      ...req.body,
      password:hash,
      emailToken:new Date().toISOString()
    });

    // console.log("Checking User", newUser)

    const userSuccess = await newUser.save();
    res.status(201).send("User has been created")

    const ownerHTMLMsg = `<p>Hello ${userSuccess.username}, verify your email by clicking this link...</p>
    <a href="http://localhost:3000/verifyEmail?emailToken=${userSuccess.emailToken}">Verify Your Email</a>`

    sendMail(userSuccess,ownerHTMLMsg,"USER VERIFICATION EMAIL")

  } catch(err){
    // res.status(500).send("something went wrong !")
    next(err)
  }
}

export const verifyEmail = async (req, res) => {
  try {
    const emailToken = req.body.emailToken;

    if (!emailToken) return res.status(404).json("EmailToken not found...");

    const user = await User.findOne({ emailToken });

    if (user) {
      user.emailToken = null;
      user.isVerified = true;

      await user.save();

      const token = jwt.sign({
        id:user._id,
        isSeller:user.isSeller
      },process.env.JWT_KEY)

      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token,
        isVerified: user?.isVerified
      });
    } else res.status(404).json("Email verification failed, invalid token!");
  } catch (error) {
    console.log(error);
    res.status(500).json(error.message);
  }
};

export const login = async (req,res,next) =>{
  try{
    const user = await User.findOne({username:req.body.username});
    if(!user) return next(createError(404,"wrong username/password "));

    const isCorrect = bcryptjs.compareSync(req.body.password,user.password)
    if(!isCorrect) return next(createError(404,"wrong username/password "));

    const token = jwt.sign({
      id:user._id,
      isSeller:user.isSeller
    },process.env.JWT_KEY)

    const {password, ...info} = user._doc

    res.cookie("accessToken",token,{
      httpOnly:true,
    }).status(200).send(info)
  }catch(err){
    next(err)
  }
}

export const logout = async (req,res) =>{
  res.clearCookie("accessToken",{
    sameSite:"none",
    secure:true
  })

  .status(200)
  .send("User has been logged out.");
}