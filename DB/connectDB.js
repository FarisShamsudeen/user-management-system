const mongoose = require('mongoose')
const Schema = mongoose.Schema

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/userManagement', { })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

module.exports = connectDB