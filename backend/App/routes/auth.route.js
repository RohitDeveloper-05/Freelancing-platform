import express from 'express'
import { register,login,logout,verifyEmail} from '../controllers/auth.controller.js'

console.log("Inside the auth.route.js")
const router = express.Router()

router.post("/register",register)
router.post("/login",login)
router.post("/logout",logout)
router.post("/verifyUserEmail",verifyEmail)

export default router