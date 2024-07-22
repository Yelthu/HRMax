import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
    Emp_No: {
        type: Number,
        default: ''
    },
    Name: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        default: ''
    },
    Leave_Type: {
        type: String,
        require: true,
        enum: ['Casual Leave', 'Annual Leave', 'Hospitalisation Leave', 'Maternity Leave', 'Unpaid Leave','Sick Leave']
    },
    Start_Date: {
        type: Date,
        require: true
    },
    End_Date: {
        type: Date,
        require: true,
        validate: {
            validator: function (value) {
                return value >= this.Start_Date
            },
            message: 'End date must be greater than or equal to start date'
        }
    },
    Start_Leave_Type: {
        type: String,
        require: true,
        enum: ['Full Day', 'Half Day'],
        default: 'Full Day'
    },
    End_Leave_Type: {
        type: String,
        require: true,
        enum: ['Full Day', 'Half Day'],
        default: 'Full Day'
    },
    No_Of_Days: {
        type: Number,
        default: 0
    },
    Reason: {
        type: String,
        require: true
    },
    File: {
        type: String,
    },
    Status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    State: {
        type: String,
        enum: ["HR Approval", "Management Approval"],
        default: 'HR Approval'
    }
}, { timestamps: true })

leaveSchema.statics.calculateLeaveBalance = async function (empName, fiscalYearStart, fiscalYearEnd) {
    const Leave = this;

    const results = await Leave.aggregate([
        {
            $match: {
                //userId: mongoose.Types.ObjectId(userId),
                Name: empName,
                Start_Date: { $gte: new Date(fiscalYearStart) },
                End_Date: { $lte: new Date(fiscalYearEnd) }
            }
        },
        {
            $project: {
                Leave_Type: 1,
                leaveDays: {
                    $add: [
                        {
                            $divide: [
                                { $subtract: ['$End_Date', '$Start_Date'] },
                                1000 * 60 * 60 * 24 // Convert milliseconds to days
                            ]
                        },
                        1 // Add one day for the inclusive end date
                    ]
                }
            }
        },
        {
            $group: {
                _id: '$Leave_Type',
                totalLeaveDays: { $sum: '$leaveDays' }
            }
        },
        {
            $project: {
                leaveType: '$_id',
                totalLeaveDays: 1
            }
        }
    ]);

    return results;
}

export default mongoose.model('Leave', leaveSchema)

