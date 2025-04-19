require('dotenv').config()
const mongoose = require('mongoose')

const connectToDb = () => {
    mongoose.connect(process.env.dbConnectionString)
        .then(() => console.log(`Connected to MongoDB successfully`))
        .catch(e => console.log(`Error connecting to MongoDB ${e}`))
}
module.exports = { connectToDb }