var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('User', new Schema({
    unique_id: Number,
    name: String,
    email: String,
    phone: String,
    username: String,
    password: String,
    passwordConf: String,
    user_status:String,
	image:String,
    admin: Boolean,
}));
