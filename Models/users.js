const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define user schema
const usersSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }
}, { timestamps: true }); // Add timestamps for createdAt and updatedAt

// Create and export the user model
const UserModel = mongoose.model('User', usersSchema);
module.exports = UserModel;
