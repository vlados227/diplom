import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    role:{
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
}, {
    timestamps: true,
})

export default mongoose.model('User', UserSchema)