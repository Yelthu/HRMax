import mongoose from "mongoose";
import dutySchema from './Duty.js';

const schedulingSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    duties: {
        type: [dutySchema],
        require: true
    }
})

export default mongoose.model('Scheduling', schedulingSchema)