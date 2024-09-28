import mongoose from 'mongoose'
const ConfigureDb = async() =>{  
  try{
    const db = await mongoose.connect(process.env.DB_URL)
    console.log('connected to Database ' + db.connections[0].name)
  }
  catch(err){
    console.log(err)
  }
}

export default ConfigureDb
