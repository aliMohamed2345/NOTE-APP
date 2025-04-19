const express = require('express')
const { verifyToken } = require('../middlewares/verifyToken')
const { getUserNotes, createNote, getNoteById ,updateNoteById, DeleteNoteById,searchInNotes} = require('../controllers/notesControllers')

const router = express.Router()

//routes
router.get('/', verifyToken,getUserNotes )
router.post('/', verifyToken, createNote)
router.get('/search', verifyToken,searchInNotes)
router.get('/:id', verifyToken, getNoteById)
router.patch('/:id', verifyToken, updateNoteById)
router.delete('/:id', verifyToken, DeleteNoteById)

module.exports = router 