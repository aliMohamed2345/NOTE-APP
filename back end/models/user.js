const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true, // Removes any leading/trailing whitespace
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [50, 'Username cannot be longer than 50 characters'],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long'],
    },
}, { timestamps: true })


const User = mongoose.model('User', userSchema)
module.exports = User