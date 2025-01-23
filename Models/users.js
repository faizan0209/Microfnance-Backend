const mongoose = require('mongoose');
const { type } = require('os');
const { string } = require('joi');
const Schema = mongoose.Schema;

const usersSchema = new Schema({
    name:{
        type: String,
        require: true

    },
    email:{
        type: String,
        require: true,
        unique: true

    },
    password:{
        type: String,
        require: true,
    },
})
const userModel = mongoose.model('users',usersSchema)
module.exports = userModel;