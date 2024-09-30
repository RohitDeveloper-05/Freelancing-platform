import User from "../models/User.model.js"

export const register = async (req,res) =>{
  console.log('register fn is getting called')
  try{
    const newUser = new User(req.body);

    await newUser.save();
    res.status(201).send("User has been created")


  } catch(err){
    res.status(500).send("something went wrong !")
  }
}

export const login = async (req,res) =>{
  try{

  }catch(err){
    
  }
}

export const logout = async (req,res) =>{
  try{

  }catch(err){
    
  }
}