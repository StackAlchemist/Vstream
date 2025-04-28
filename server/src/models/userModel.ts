import mongoose from 'mongoose';
import {isEmail} from 'validator'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        lowercase: true,
        validate: [isEmail]
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
},{timestamps: true})

const User = mongoose.model('users', userSchema)
export default User