//imports
const express = require('express');
const dotenv = require('dotenv').config();
const fileUpload = require('express-fileupload');

//import db connection
const dbConnect = require('./config/Database');
const cloudinary = require('./config/Cloudinary');
const Upload = require('./routes/FileUpload');
//middlewares
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(fileUpload());

dbConnect.connect();
cloudinary.cloudinaryConnect();

//route mounting
app.use('/api/v1/upload', Upload);

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})