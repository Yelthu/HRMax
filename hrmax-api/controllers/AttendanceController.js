import Attendance from "../models/Attendance.js"
import { convertTimestampToDateString } from "../utils/utils.js"

export const getAttendanceSearch = async (req, res, next) => {
    try {
        let { att_date, Name } = req.query.q
        let searchQuery

        const trimName = Name.trim()
        const regexName = new RegExp(trimName, 'i')

        if (att_date) {
            att_date = new Date(att_date).getTime()
        }

        if (att_date && Name) {
            searchQuery = {
                Date: att_date,
                Name: regexName
            };
        }
        else if (att_date) {
            searchQuery = {
                Date: att_date,
            };
        }
        else if (Name) {
            searchQuery = {
                Name: regexName
            };
        }
        const projection = { Emp_No: 1, Name: 1, Date: 1, Clock_In: 1, Clock_Out: 1, _id: 0 }

        const attendances = await Attendance.find(searchQuery, projection)

        const attendanceRetriveArray = []

        for (var i = 0; i < attendances.length; i++) {
            var attendance = attendances[i]
            const dateString = convertTimestampToDateString(attendance.Date)

            var attendanceRetrive = {
                Emp_No: attendance.Emp_No,
                Name: attendance.Name,
                Date: dateString,
                Clock_In: attendance.Clock_In,
                Clock_Out: attendance.Clock_Out
            }

            attendanceRetriveArray.push(attendanceRetrive)
        }
        const newArray = attendanceRetriveArray.map(({ _id, ...rest }) => rest);

        res.status(200).json(newArray)

    } catch (error) {
        next(error)
    }
}

export const getAttendance = async (req, res, next) => {
    try {
        const projection = { Emp_No: 1, Name: 1, Date: 1, Clock_In: 1, Clock_Out: 1, _id: 0 }

        const attendances = await Attendance.find({}, projection);
        const attendanceRetriveArray = []

        for (var i = 0; i < attendances.length; i++) {
            var attendance = attendances[i]
            const dateString = convertTimestampToDateString(attendance.Date)

            var attendanceRetrive = {
                Emp_No: attendance.Emp_No,
                Name: attendance.Name,
                Date: dateString,
                Clock_In: attendance.Clock_In,
                Clock_Out: attendance.Clock_Out
            }

            attendanceRetriveArray.push(attendanceRetrive)
        }
        const newArray = attendanceRetriveArray.map(({ _id, ...rest }) => rest);

        res.status(200).json(newArray);
    } catch (err) {
        next(err);
    }
}