const mongoose = require('mongoose');


// connection to database with mongodburi environment variables
const connectDB = async()=> {
    try{
        mongoose.set('strictQuery', false);
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected : ${conn.connection.host}`);
    }catch (error){
        console.log(error);
    }
}

module.exports = connectDB;