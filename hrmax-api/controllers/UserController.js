import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { generateNextEmpNo } from "../utils/utils.js";


export const register = async (req, res, next) => {
    try {

        const exitedUser = await User.find({ Name: req.body.name })
        if (exitedUser.length > 0) {
            return res.status(409).json({ message: 'Your user name is already existed,please take another one' })
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);

        const empNo = await generateNextEmpNo()

        const newUser = new User({
            Name: req.body.name,
            Email: req.body.email,
            Password: hash,
            Branch: req.body.branch,
            Emp_No: empNo,
        })

        await newUser.save()
        res.status(200).send('User has been created')
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted" });
    } catch (err) {
        next(err);
    }
}

export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export const searchUsers = async (req, res, next) => {
    const query = req.query.q;

    try {
        let users;
        if (query) {
            users = await User.find({
                $or: [
                    { Name: { $regex: query, $options: 'i' } },
                    { Email: { $regex: query, $options: 'i' } }
                ],
            }).limit(10);
        }
        else {
            users = await User.find();
        }

        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
}