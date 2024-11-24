import mongoose from 'mongoose';

// Load environment variables from .env file
require('dotenv').config();

const connectToMongoDB = async () => {
    try {
        // Replace `process.env.MONGO_URI` with your MongoDB connection string
        const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/secret-santa';
        await mongoose.connect(mongoURI)
        console.log('Connected to MongoDB successfully');
    } catch (error:any) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit process with failure
    }
};

export default connectToMongoDB;
