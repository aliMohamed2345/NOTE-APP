const { default: mongoose } = require("mongoose");
const Note = require("../models/notes");

const getUserNotes = async (req, res) => {
    const { id: userId } = req.user
    const page = +req.query.page || 1
    const notesPerPage = 10;

    try {
        if (page < 1) {
            res.status(400).json({ success: false, message: `Invalid Page Number` })
        }
        const notes = await Note.find({ User: userId }).sort({ createdAt: -1 }).limit(notesPerPage).skip((page - 1) * notesPerPage);
        const totalNotes = await Note.countDocuments({ User: userId })
        res.status(200).json({ success: true, notes, totalNotes, totalPage: Math.ceil(totalNotes / notesPerPage) })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error` })
    }
}
const createNote = async (req, res) => {
    try {
        const UserId = req.user.id;
        const { tags = [], title, description } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: `The Title Note Is Required` });
        }

        const isTitleExist = await Note.findOne({ title });
        if (isTitleExist) {
            return res.status(400).json({ success: false, message: `The Title Must Be Unique` });
        }

        if (!description) {
            return res.status(400).json({ success: false, message: `The Description Note Is Required` });
        }

        const note = await Note.create({ tags, title, description, User: UserId });

        return res.status(201).json({ success: true, note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: `Internal Server Error` });
    }
};

const getNoteById = async (req, res) => {
    try {
        const { id: noteId } = req.params;

        //checking the validation of the note id 
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ success: false, message: 'Invalid Note ID' });
        }
        const note = await Note.findOne({ _id: noteId })
        if (!note) {
            return res.status(404).json({ success: false, message: `Note Not Found` })
        }
        res.status(200).json({ success: true, note })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error` })
    }

}
const updateNoteById = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { id: noteId } = req.params;
        //checking the validation of the note id 
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ success: false, message: `Invalid Note ID` })
        }
        const updatedNote = await Note.findByIdAndUpdate({ _id: noteId }, { title, description }, { new: true })
        //checking if the note is exist 
        if (!updatedNote) return res.status(404).json({ success: false, message: `Note Not Found` })

        res.status(200).json({ success: true, note: updatedNote })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error` })
    }
}
const DeleteNoteById = async (req, res) => {
    try {
        const { id: noteId } = req.params;
        //checking the validation of the note id 
        if (!mongoose.Types.ObjectId.isValid(noteId)) {
            return res.status(400).json({ success: false, message: 'Invalid Note ID' });
        }
        await Note.deleteOne({ _id: noteId })
        res.status(200).json({ success: true, message: `The Note Has Been Deleted` })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error` })
    }
}
const searchInNotes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ success: false, message: `please enter any search term` })
        //this will search in the terms in database weather it exist in the title or description 
        const searchedNotes = await Note.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ]
        })
        const notesNumber = await Note.countDocuments()
        if (searchedNotes.length === 0) return res.status(400).json({ success: true, message: `There's no Notes With the Term ${q}` })
        res.status(200).json({ success: true, totalNotes: notesNumber, notes: searchedNotes })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: `Internal Server Error` })
    }

}
module.exports = { getUserNotes, createNote, getNoteById, updateNoteById, DeleteNoteById, searchInNotes };