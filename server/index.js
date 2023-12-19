const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const upload = multer();
const authRoutes = require("./routes/auth").default
const userRoutes = require('./routes/users').default
const postRoutes = require('./routes/posts').default
const fileUpload = require('express-fileupload');

//Middlewares
dotenv.config();
const server = express();
server.use(fileUpload({
    useTempFiles: true
}))
server.use(express.json());
server.use(helmet());
server.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
server.use(morgan("common"));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());
server.use("/auth", authRoutes);
server.use('/users', userRoutes);
server.use('/posts', postRoutes);

//Mongoose
const PORT = process.env.PORT || 6001;
async function main() {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Sucessfully");
    server.listen(PORT, () => {
        console.log("Server Started Sucessfully");
    })
}

try {
    main();
} catch (err) {
    console.log(err);
}