const Post = require('../models/Post').default;

const cloudinary = require('../utils/cloudinary').default;

//create
async function createPost(req, res) {
    try {
        const { userId, description } = req.body;
        let result = null;
        if (req.files) {
            result = await cloudinary.uploader.upload(req.files.picture.tempFilePath, {
                folder: "posts",
            });
        }

        const newPost = new Post({
            user: userId,
            description,
            picturePath: `${result?result.secure_url:"N/A"}`,
            likes: {}
        })
        await newPost.save();
        const post = await Post.find().populate("user").exec();
        post.reverse();
        res.status(201).json(post);
    } catch (error) {
        console.log("Error ", error.message);
        res.status(409).json({ message: error.message });
    }
}

//read
async function getFeedPosts(req, res) {
    try {
        const posts = await Post.find().populate('user').exec();
        posts.reverse();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function getUserPosts(req, res) {
    try {
        const { id } = req.params;
        const posts = await Post.find({ user: id }).populate('user').exec();
        posts.reverse();
        res.status(200).json(posts);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function likePost(req, res) {
    //console.log("Lets Check this");
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        //console.log("main", post);
        const isLiked = post.likes.get(userId);
        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }
        const updatedPost = await Post.findByIdAndUpdate({ _id: id }, { likes: post.likes }, { new: true }).populate("user").exec();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}

//delete
async function deletePost(req, res) {
    const { id } = req.params;
    const { user, postUser } = req.body;
    if (user != postUser) res.status(500).json({ err: err.message });
    else {
        try {
            const deletedres = await Post.deleteOne({ _id: id });
            //console.log(deletedres);
            const posts = await Post.find().populate("user").exec();
            posts.reverse();
            res.status(200).json(posts);
        } catch (err) {
            console.log(err.message)
            res.status(500).json({ err: err.message });
        }
    }
}

//postComment
async function addComment(req, res) {

    const { id } = req.params;
    const { comment, name } = req.body;

    try {
        const post = await Post.findById(id);
        post.comments.push(`${name}${id}/0${comment}`);
        await post.save();
        const updatedPost = await Post.findById(id).populate("user").exec();
        //console.log('check ', updatedPost);
        res.status(200).json(updatedPost);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ err: err.message });
    }
}

exports.postControllers = { createPost, getFeedPosts, getUserPosts, likePost, deletePost, addComment };