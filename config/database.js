const mongoose = require('mongoose');

require('dotenv').config();

const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('database connected successfully');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = connectDB;