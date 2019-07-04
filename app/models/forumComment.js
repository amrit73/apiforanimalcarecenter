var mongoose = require('mongoose');
var Schema = mongoose.Schema;

forumCommentSchema = new Schema( {
	unique_id: Number,
	forum_id: Schema.Types.ObjectId,    // data_type is objectId  for foreign key of forum table
	description: String,
    author     : String
});
ForumComment = mongoose.model('ForumComment', forumCommentSchema);

module.exports = ForumComment;
