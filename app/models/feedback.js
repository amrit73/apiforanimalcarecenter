var mongoose = require('mongoose');
var Schema = mongoose.Schema;

feedbackSchema = new Schema({
    unique_id: Number,
    name: String,
    email: String,
    phone: String,
    message: String
});
Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
