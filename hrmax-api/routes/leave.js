import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url';
import Leave from '../models/Leave.js'
import { getLeaveListForEmp, approveLeave, getLeaves, getCasualLeave, rejectLeave, updateLeave, getLeaveBalance, registerLeaveBalance, getAllocatedLeaveBalance } from '../controllers/LeaveController.js'

const router = express.Router()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'leave-attached')
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath)
        }
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
})

const upload = multer({ storage });

router.post('/request', upload.single('attachedFiles'), async (req, res, next) => {

    try {
        const leave = new Leave({
            Name: req.body.name,
            Email: req.body.email,
            Leave_Type: req.body.leaveType,
            Start_Date: req.body.startDate,
            End_Date: req.body.endDate,
            No_Of_Days: req.body.numofDays,
            Start_Leave_Type: req.body.startleaveType,
            End_Leave_Type: req.body.End_Leave_Type,
            Reason: req.body.reason,
            File: req.file ? req.file.path : null
        })

        await leave.save()
        res.status(200).json({ message: 'Your leave has been applied' })

    } catch (error) {
        next(error)
    }
});

router.get('/leave-list-emp', getLeaveListForEmp)
router.post('/register-leave-balance', registerLeaveBalance)
router.get('/allocated-balance', getAllocatedLeaveBalance)
router.put('/:id', updateLeave)
router.get('/', getLeaves)
router.get('/casual', getCasualLeave)
router.get('/leave-balance', getLeaveBalance)
router.post('/approve', approveLeave)
router.post('/reject', rejectLeave)

export default router