const mongoose = require('mongoose');
const User = require('../models/User');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: String,
    picturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: [{ type: String, default: [] }]
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema);
exports.default = Post;