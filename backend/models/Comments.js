const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    Comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    }

},{timestamp:true}
)

module.exports = mongoose.model("Comment", CommentSchema);