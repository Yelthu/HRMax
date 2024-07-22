import mongoose from "mongoose";

const dutySchema = new mongoose.Schema({
    date: {
        type: Date,
        require: true
    },
    status: {
        type: String,
        require: true
    }
})

export default dutySchema
