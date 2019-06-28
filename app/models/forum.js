var mongoose = require('mongoose');
var Schema = mongoose.Schema;

forumSchema = new Schema({
    unique_id: Number,
    title: String,
    description: String,
    author: String
});
Forum = mongoose.model('Forum', forumSchema);

module.exports = Forum;