require('dotenv').config()

//packages
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
//routes
const authRoutes = require('./routes/authRoutes')
const notesRoutes = require('./routes/notesRoutes')
const { connectToDb } = require('./db')
const app = express()

const portNumber = process.env.PORT || 3000

//middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: `http://localhost:3000`
    , credentials: true
}))
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes)

//DB Connection
connectToDb()

app.listen(portNumber, () => { console.log(`the server is working on port ${portNumber}`) })