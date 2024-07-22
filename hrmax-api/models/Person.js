import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    date: String,
    value: String,

    day: String,
    value: String,
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    assigned: {
        type: String,
        require: true
    },
    month: {
        type: String,
        require: true
    },
    year: {
        type: Number,
        require: true
    },
    tasks: [taskSchema],
    rostaRatio: String
})

personSchema.virtual('normalizedName').get(function () {
    return this.name.replace(/\s+/g, '').toLowerCase();
})

export default mongoose.model('Person', personSchema)