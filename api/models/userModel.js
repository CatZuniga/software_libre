const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    fullname: { type: String },
    username: { type: String },
    password: { type: String }
});

const allowedAttributes = ['fullname', 'username', 'password'];

module.exports.User = mongoose.model('users', user);
module.exports.UserAllowedAttributes = allowedAttributes;