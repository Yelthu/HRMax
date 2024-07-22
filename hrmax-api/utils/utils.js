import User from "../models/User.js";
import path from 'path'
import { fileURLToPath } from 'url';

export const fiscalYearStart = '2024-04-01T00:00:00.000Z';
export const fiscalYearEnd = '2025-03-31T23:59:59.999Z';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..')

const uploadDir = path.join(projectRoot, 'public', 'uploads');

export const userImagesDir = path.join(uploadDir, 'user-photos')

export const leaveAttachmentsDir = path.join(uploadDir, 'user-photos')

export const userRegisterationDir = path.join(uploadDir, 'user-registeration')

export const schedulingAttachmentsDir = path.join(uploadDir, 'scheduling')

export const generateNextEmpNo = async () => {
    const lastEmp = await User.findOne().sort({ Emp_No: -1 })

    let newEmpCode = '0601'

    if (lastEmp.Emp_No !== null && lastEmp.Emp_No !== undefined) {
        const lastCode = parseInt(lastEmp.Emp_No, 10)
        newEmpCode = (lastCode + 1).toString().padStart(4, '0')
    }

    return newEmpCode
}

export const splitDate = (dateString) => {

    const splitDate = dateString.split('/')
    const year = splitDate[2]
    const day = splitDate[1]
    const month = splitDate[0]

    return { year, month, day }

}

export const getFirstAndLastDateOfMonth = (date) => {

    const givenDate = new Date(date);

    const firstDay = new Date(givenDate.getFullYear(), givenDate.getMonth(), 1);

    const lastDay = new Date(givenDate.getFullYear(), givenDate.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999)

    return { firstDay, lastDay };
}

export const convertTimestampToDateString = (timestamp) => {

    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export const calculateServiceYears = (joinedDate) => {
    const currentDate = new Date()
    const hiredDate = new Date(joinedDate)

    const yearsOfService = currentDate.getFullYear() - hiredDate.getFullYear()

    return yearsOfService
}

export const getCurrentYearAndMonth = () => {
    const currentDate = new Date();
    const options = { month: 'long', year: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString('en-US', options);

    const [month, year] = formattedDate.split(' ');

    return { month, year }
}
