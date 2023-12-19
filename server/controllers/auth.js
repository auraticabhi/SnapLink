const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User').default;
const cloudinary = require('../utils/cloudinary').default;

async function register(req, res) {
    try {
        let { firstName, lastName, email, password, friends, location, occupation } = req.body;
        //console.log(req.body);
        email = email.trim();
        password = password.trim();
        let result = null;
        if (req.files) {
            result = await cloudinary.uploader.upload(req.files.picture.tempFilePath, {
                folder: "posts",
            });
        } else {
            result = {
                secure_url: "https://res.cloudinary.com/dpb4cpdk3/image/upload/v1701536960/posts/baxiahf9cjupxxf1vs3a.jpg"
            }
        }
        const salt = bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, parseInt(salt));
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath: result.secure_url,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

async function login(req, res) {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim()
        const user = await User.findOne({ email: email }).populate('friends').exec();
        if (!user) {
            return res.status(400).json({ msg: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({ token, user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: error.message });
    }
}

exports.authControllers = { register, login };