import express from 'express'
import multer from 'multer'
import fs from 'fs'
import csv from 'csv-parser'
import { verify, verifyAdmin } from '../utils/verifyToken.js'
import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import { generateNextEmpNo } from "../utils/utils.js";
import { deleteUser, getUsers, register, searchUsers } from '../controllers/UserController.js'
import { calculateServiceYears, userImagesDir, userRegisterationDir } from '../utils/utils.js'

const router = express.Router()

const storageRegistration = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(userRegisterationDir)) {
            fs.mkdirSync(userRegisterationDir, { recursive: true })
        }
        cb(null, userRegisterationDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const uploadUser = multer({ storage: storageRegistration });

router.post('/upload-user-list', uploadUser.single('file'), verify, async (req, res, next) => {

    const results = [];
    const file = req.file;
    const filePath = file.path;
    const temPass = process.env.TEMP_PASS;
    var userList = [];

    try {

        fs.createReadStream(filePath)
            .pipe(csv({ headers: false }))
            .on('data', (data) => results.push(data))
            .on('end', async () => {

                const [header, ...rows] = results;

                for (const row of rows) {

                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(temPass, salt);

                    const empNo = await generateNextEmpNo();

                    const user = new User({
                        Name: row['0'],
                        Email: row['1'],
                        Role: row['2'],
                        Emp_Type: row['3'],
                        JoinedDate: new Date(row['4']),
                        YearsOfService: calculateServiceYears(row['4']),
                        Emp_No: empNo,
                        Password: hash,
                        Branch: 'HOCO YGN & MDY'
                    })

                    userList.push(user);

                    await user.save();
                }

                fs.unlinkSync(filePath);

                res.status(200).json(userList);

            })

    } catch (error) {
        next(error);
    }

});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(userImagesDir)) {
            fs.mkdirSync(userImagesDir, { recursive: true })
        }
        cb(null, userImagesDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
})

const upload = multer({ storage });

router.post('/update', upload.single('profilePicture'), verify, async (req, res, next) => {

    try {
        const { id } = req.query

        const updates = {
            Name: req.body.name,
            Email: req.body.email,
            Role: req.body.role,
            Emp_Type: req.body.empType,
            JoinedDate: req.body.joinedDate,
            YearsOfService: calculateServiceYears(req.body.joinedDate),
            ProfilePicture: req.file ? `/uploads/user-photos/${req.file.filename}` : null
        }

        Object.keys(updates).forEach(key => {
            if (updates[key] === '' || updates[key] === null || updates[key] === undefined) {
                delete updates[key];
            }
        });

        const updatedBy = req.user._id

        const user = await User.findByIdAndUpdate(id, {
            ...updates,
            updatedBy,
            updatedAt: Date.now()
        }, { new: true })

        if (!user)
            return res.status(404).json({ message: 'Your updated user name is not found' })

        res.status(200).send(user)

    } catch (error) {
        next(error)
    }
});


router.get('/checkauthentication', verify, (req, res, next) => {
    res.send('Hello user, you are logged in ')
})

router.get('/checkadmin/:id', verifyAdmin, (req, res, next) => {
    res.send('Hello admin, you are logged in and you can manage all accounts')
})

router.post('/register', register)

//router.delete('/:id', deleteUser)
router.delete('/:id', verifyAdmin, deleteUser)

//router.get('/', getUsers)
router.get('/', verifyAdmin, getUsers)

router.get('/search', searchUsers)


export default router