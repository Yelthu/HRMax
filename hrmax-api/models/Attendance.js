import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
    Emp_No: {
        type: Number,
        require: true
    },
    AC_No: {
        type: Number,
        require: true
    },
    No: {
        type: String,
        default: ''
    },
    Name: {
        type: String,
        require: true
    },
    Auto_Assign: {
        type: String,
        default: ''
    },
    Date: {
        type: Number,
        require: true,
    },
    Timetable: {
        type: String,
        require: true
    },
    On_duty: {
        type: String,
        default: "09:00"
    },
    Off_Duty: {
        type: String,
        default: "18:00"
    },
    Clock_In: {
        type: String,
    },
    Clock_Out: {
        type: String,
    },
    Normal: {
        type: Number,
    },
    Real_Time: {
        type: Number,
    },
    Late: {
        type: String,
    },
    Early: {
        type: String,
    },
    Absent: {
        type: String,
    },
    OT_Time: {
        type: String,
    },
    Work_Time: {
        type: String,
    },
    Exception: {
        type: String,
    },
    Must_Cin: {
        type: String,
        default: true
    },
    Must_Cout: {
        type: String,
        default: true
    },
    Department: {
        type: String,
        default: "OUR COMPANY"
    },
    NDays: {
        type: Number,
    },
    WeekEnd: {
        type: String
    },
    Holiday: {
        type: String,
    },
    ATT_Time: {
        type: String
    },
    NDays_OT: {
        type: Number,
    },
    WeekEnd_OT: {
        type: String
    },
    Holiday_OT: {
        type: Number,
    }
})

attendanceSchema.virtual('normalizedName').get(function () {
    return this.Name.replace(/\s+/g, '').toLowerCase();
})

export default mongoose.model('Attendance', attendanceSchema)