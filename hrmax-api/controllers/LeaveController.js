import Leave from '../models/Leave.js'
import LeaveBalance from '../models/LeaveBalance.js'
import { fiscalYearStart, fiscalYearEnd } from '../utils/utils.js'

export const registerLeaveBalance = async (req, res, next) => {

    try {
        const leaveBalance = new LeaveBalance({
            Leave_Type: req.body.leaveType,
            Fiscal_Year_Start: req.body.fiscalYearStart,
            Fiscal_Year_End: req.body.fiscalYearEnd,
            Leave_Balance: req.body.leaveBalance,
            Emp_Type: req.body.empType,
            Min_Service_Years: req.body.minServiceYear,
            Max_Service_Years: req.body.maxServiceYear,
        })

        await leaveBalance.save()
        res.status(200).json({ message: 'Leave Balance has been registered' })

    } catch (error) {
        next(error)
    }

}

export const updateLeave = async (req, res, next) => {
    try {

        const { id } = req.params

        const updatedData = {
            Leave_Type: req.body.leaveType,
            Start_Date: req.body.startDate,
            End_Date: req.body.endDate,
            Reason: req.body.reason,
        }

        const leave = await Leave.findByIdAndUpdate(id, updatedData, {
            new: true,
            //runValidators: true
        })

        if (!leave) {
            return next(createError(404, 'Leave not found!'))
        }

        res.status(200).json({ message: 'Your leave has been changed and applied' })

    } catch (error) {
        next(error)
    }
}

export const getLeaves = async (req, res, next) => {
    try {
        const { state } = req.query

        const searchQuery = {
            State: state
        }

        const leaves = await Leave.find(searchQuery)

        res.status(200).json(leaves)
    } catch (error) {
        next(error)
    }
}

export const getLeaveListForEmp = async (req, res, next) => {
    try {
        const { name } = req.query

        const searchQuery = {
            Name: name,
        }

        const projection = { Name: 1, Leave_Type: 1, Start_Date: 1, End_Date: 1, Reason: 1, Status: 1, No_Of_Days: 1, _id: 1 }

        const leaves = await Leave.find(searchQuery, projection)

        res.status(200).json(leaves)

    } catch (error) {
        next(error)
    }
}

export const getAllocatedLeaveBalance = async (req, res, next) => {
    try {
        const { emptype, yearsOfService } = req.query
        const numYearsOfService = Number(yearsOfService)

        const searchQuery = {
            Emp_Type: emptype,
            $expr: {
                $and: [
                    { $gte: [numYearsOfService, "$Min_Service_Years"] },
                    { $lte: [numYearsOfService, "$Max_Service_Years"] },
                ]
            }

        }

        const allocatedLeave = await LeaveBalance.find(searchQuery)

        res.status(200).json(allocatedLeave)
    } catch (error) {
        next(error)
    }
}

export const getCasualLeave = async (req, res, next) => {
    try {
        let { emp_no, name, startDate, leaveType } = req.query.q

        const givenDate = new Date(startDate)

        const start = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);
        const end = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 0);

        const startOfMonth = new Date(start.setHours(0, 0, 0, 0))
        const endOfDate = new Date(end.setHours(23, 59, 59, 59))

        const searchQuery = {
            // Emp_No: emp_no,
            Name: name,
            Leave_Type: leaveType,
            Start_Date: { $gte: startOfMonth },
            End_Date: { $lte: endOfDate }
        }

        const projection = { Emp_No: 1, Name: 1, Leave_Type: 1, Start_Date: 1, End_Date: 1, _id: 0 }

        const leaves = await Leave.find(searchQuery, projection)

        res.status(200).json(leaves)
    } catch (error) {
        next(error)
    }
}

export const getLeaveBalance = async (req, res, next) => {
    try {
        let { name } = req.query

        const leaveBalance = await Leave.calculateLeaveBalance(name, fiscalYearStart, fiscalYearEnd)

        res.status(200).json(leaveBalance)

    } catch (error) {
        next(error)
    }
}

export const approveLeave = async (req, res, next) => {
    try {

        const { id } = req.body

        console.log('id', id)

        const leave = await Leave.findById(id)
        if (!leave) return next(createError(404, 'Leave not found!'))

        if (leave.Status === 'Approved' && leave.State === 'Management Approval') {
            leave.State = 'Approved'
        }

        if (leave.Status === 'Pending' && leave.State === 'HR Approval') {
            leave.Status = 'Approved';
            leave.State = 'Management Approval'
        }

        await Leave.findByIdAndUpdate(id, { Status: leave.Status, State: leave.State })
        res.status(200).json({ message: 'Leave has been approved' })

    } catch (error) {
        next(error)
    }
}

export const rejectLeave = async (req, res, next) => {
    try {
        const { id, reason } = req.body

        const leave = await Leave.findById(id)
        if (!leave) return next(createError(404, 'Leave not found!'))

        leave.Status = 'Rejected';
        leave.Reason = reason

        await Leave.findByIdAndUpdate(id, { Status: leave.Status, Reason: leave.Reason })
        res.status(200).json({ message: 'Leave has been rejected' })

    } catch (error) {
        next(error)
    }
}