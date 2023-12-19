const User = require('../models/User').default;
const cloudinary = require('../utils/cloudinary').default;

//read
async function getUser(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('friends').exec();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

async function getUserFriends(req, res) {
    try {
        const { id } = req.params;
        const user = await User.findById(id).populate('friends').exec();
        const formattedFriends = user.friends.map(({
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath
        }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

//update
async function addRemoveFriend(req, res) {
    try {
        let ckr = 0;
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id != friendId);
            friend.friends = friend.friends.filter((idi) => idi != id);
            ckr = 0;
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
            ckr = 1;
        }
        console.log("User ", user.friends, " Friend ", friend.friends);
        await user.save();
        await friend.save();

        const datUser = await User.findById(id).populate('friends').exec();
        console.log(datUser);

        const formattedFriends = datUser.friends.map(({
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath
        }) => {
            return { _id, firstName, lastName, occupation, location, picturePath };
        });
        res.status(200).json(formattedFriends);
    } catch (error) {
        console.log(error.message);
        res.status(404).json({ message: error.message });
    }
}

//uploadpfp
async function uploadPhoto(req, res) {
    try {
        const { id } = req.body;
        let result = null;
        if (req.files) {
            result = await cloudinary.uploader.upload(req.files.picture.tempFilePath, {
                folder: "posts",
            });
        }
        const response = await User.findByIdAndUpdate({ _id: id }, { picturePath: result.secure_url }, { new: true }).populate('friends').exec();
        res.status(200).json(response);

    } catch (error) {
        console.log(error.message);
        res.status(500).json({ err: error.message })
    }
}

//delete
// async function deleteUser(req, res) {
//     const { user, loggedUser } = req.body;
//     if (user == loggedUser) {
//         try {
//             const deletedres = await User.deleteOne({ _id: user });
//             const psts = await Post.find();
//             for (let i = 0; i < psts.length; i++) {
//                 if (!psts.user) {
//                     await Post.deleteOne({ _id: psts._id })
//                 }
//             }
//             console.log(deletedres);
//             res.status(200).json(deletedres);
//         } catch (err) {
//             console.log(err.message)
//             res.status(500).json({ err: err.message });
//         }
//     }
// }

exports.userControllers = { getUser, getUserFriends, addRemoveFriend, uploadPhoto };