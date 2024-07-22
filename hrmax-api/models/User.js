import mongoose, { Schema } from 'mongoose';

const userSchema = new mongoose.Schema({
    Emp_No: {
        type: Number,
        unique: true
    },
    Name: {
        type: String,
        require: true,
        unique: true
    },
    Email: {
        type: String,
        default: ''
    },
    Password: {
        type: String,
        require: true
    },
    Role: {
        type: String,
        emum: ['User', 'HR', 'Admin'],
        default: 'User'
    },
    Emp_Type: {
        type: String,
        enum: ['Probation', 'Permanent']
    },
    JoinedDate: {
        type: Date
    },
    YearsOfService: {
        type: Number,
        require: true
    },
    ProfilePicture: {
        type: String
    },
    IsAdmin: {
        type: Boolean,
        default: false
    },
    Branch: {
        type: String,
        require: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true })

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    if (this.isNew) {
        this.createdAt = this.updatedAt;
    }
    next();
});

export default mongoose.model('User', userSchema)