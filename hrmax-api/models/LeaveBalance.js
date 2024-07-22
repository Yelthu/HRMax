import mongoose from "mongoose";

const leaveBalance = new mongoose.Schema({
    Leave_Type: {
        type: String,
        require: true
    },
    Fiscal_Year_Start: {
        type: Date,
        require: true
    },
    Fiscal_Year_End: {
        type: Date,
        require: true
    },
    Leave_Balance: {
        type: Number,
        require: true
    },
    Emp_Type: {
        type: String,
        enum: ['Probation', 'Permanent']
    },
    Min_Service_Years: {
        type: Number,
        default: 0
    },
    Max_Service_Years: {
        type: Number,
        default: 0
    }
})

export default mongoose.model('LeaveBalance', leaveBalance)