import express from 'express'
import Attendance from '../models/Attendance.js'
import multer from 'multer'
import csv from 'csvtojson'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import { getAttendance, getAttendanceSearch } from '../controllers/AttendanceController.js'
import { verifyAdmin } from '../utils/verifyToken.js'
import { splitDate } from '../utils/utils.js'
import Person from '../models/Person.js'
import { calculateRostaRatio } from './scheduling.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath)
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, 'uploads', req.file.filename)
        const jsonArray = await csv().fromFile(filePath)

        for (const record of jsonArray) {

            const { year, month, day } = splitDate(record.Date)

            const dateTime = new Date(Date.UTC(year, month - 1, day))

            record.Date = dateTime.getTime()

            const existingRecord = await Attendance.findOne({
                Emp_No: record.Emp_No,
                Name: record.Name,
                Date: record.Date
            })
            if (!existingRecord) {
                console.log('Record', record)
                await Attendance.create(record)
                console.log(`Inserted record: ${record.Name}`);
            } else {
                console.log(`Record already exists: ${record.Name} and ${record.Date}`);
            }

            await onAttendanceUpdate(attendanceRecord);
        }

        res.status(200).json('File uploaded and processed successfully!')

    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('An error occurred while uploading the file.')
    }
})

const onAttendanceUpdate = async (attendanceRecord) => {
    await updateRostaRatio(attendanceRecord.Name);
};

const updateRostaRatio = async (name) => {
    const normalizedName = name.replace(/\s+/g, '').toLowerCase();
    const person = await Person.findOne({ normalizedName });
    if (person) {
        person.rostaRatio = await calculateRostaRatio(person.name, person.tasks);
        await person.save();
    }
};

router.get('/', getAttendance)

router.get('/search', getAttendanceSearch)
// router.get('/', verifyAdmin ,getAttendanceSearch)

export default router