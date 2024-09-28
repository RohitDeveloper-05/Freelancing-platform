import ConfigureDb from './Config/ConfigureDb.js'
import expresss from 'express'
import dotenv from 'dotenv'

const app = expresss()
dotenv.config()

ConfigureDb()

app.listen(8800, ()=>{
  console.log("Backend is Running")
})
