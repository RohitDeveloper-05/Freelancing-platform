import User from "../models/User.model.js"
import bcryptjs from 'bcryptjs'
import jwt from "jsonwebtoken"
import createError from "../utils/createError.js"

export const register = async (req,res,next) =>{
  console.log('register fn is getting called')
  try{
    const salt = bcryptjs.genSaltSync()
    const hash = bcryptjs.hashSync(req.body.password,salt)
    const newUser = new User({
      ...req.body,
      password:hash
    });

    await newUser.save();
    res.status(201).send("User has been created")

  } catch(err){
    // res.status(500).send("something went wrong !")
    next(err)
  }
}

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
  try{

  }catch(err){
    
  }
}