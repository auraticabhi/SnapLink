const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true, min: 2, max: 50 },
    lastName: { type: String, required: true, min: 2, max: 50 },
    email: { type: String, required: true, max: 50, unique: true },
    password: { type: String, required: true, min: 5, max: 50 },
    picturePath: { type: String, default: "https://res.cloudinary.com/dpb4cpdk3/image/upload/v1701536960/posts/baxiahf9cjupxxf1vs3a.jpg" },
    friends: [{ type: mongoose.ObjectId, ref: 'User', default: [] }],
    location: { type: String, default: "Earth" },
    occupation: { type: String, default: "None of your Business" },
    viewedProfile: Number,
    impressions: Number
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
exports.default = User;