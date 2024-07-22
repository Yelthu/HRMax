import jwt, { decode } from 'jsonwebtoken'
import createError from '../utils/error.js'

export const verify = (req, res, next) => {

    const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1]

   // console.log(req)

    //console.log('token', token)

    if (!token) return next(createError(401, 'You are not authenticated'))

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(createError(403, 'Token is not valid'))
        }

        req.user = decoded;

       // console.log(req.user)

        next()
    })
}

export const verifyAdmin = (req, res, next) => {
    verify(req, res, next, () => {
   
        if (req.user.IsAdmin) next()
        else return next(createError(403, 'You are not authorized'))
    })
}