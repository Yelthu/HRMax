import express from 'express'
import { login, register, resetPassword } from '../controllers/AuthContoller.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.put('/resetPassword', resetPassword)


export default router