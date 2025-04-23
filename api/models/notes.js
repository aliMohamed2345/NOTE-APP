const mongoose = require('mongoose')


const NotesSchema = new mongoose.Schema({
    title: {  type: String, unique: true, require: true },
    description: { type: String, require: true },
    tags: [String],
    User: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Note = mongoose.model('Note', NotesSchema);
module.exports = Note