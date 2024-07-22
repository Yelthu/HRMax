import User from "../models/User.js"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import createError from '../utils/error.js'

export const register = async (req, res, next) => {
    try {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.Password, salt);

        const newUser = new User({
            Emp_No: req.body.Emp_No,
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hash,
            IsAdmin: req.body.IsAdmin
        })
        await newUser.save()
        res.status(200).send('User has been created')
    } catch (error) {
        next(error)
    }
}

export const login = async (req, res, next) => {
    try {

        const user = await User.findOne({ Name: req.body.Name })
        if (!user) return next(createError(404, 'User not found!'))

        const isCorrectPassword = await bcrypt.compare(req.body.password, user.Password)
        if (!isCorrectPassword) return next(createError(400, 'Wrong password or username!'))

        const token = jwt.sign({ _id: user._id, IsAdmin: user.IsAdmin }, process.env.JWT_SECRET)//, { expiresIn: '1h' }

        //console.log('Token Generation...', token)

        const { Password, ...otherDetails } = user._doc

        res.cookie('access_token', token,
            { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', }).status(200).json({ details: { ...otherDetails } })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req, res, next) => {
    try {

        const emp_email = req.body.email

        const user = await User.findOne({ Email: emp_email })
        if (!user) return next(createError(404, 'User not found!'))

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.newpassword, salt);

        const resetPassword = await User.updateOne(
            { Email: emp_email },
            { $set: { Password: hash } }
        )

        if (resetPassword.matchedCount > 0)
            res.status(200).json({ message: 'Your password has changed successfully' })
        else res.status(404).json({ message: 'User not found' });

    } catch (error) {
        next(error)
    }
}