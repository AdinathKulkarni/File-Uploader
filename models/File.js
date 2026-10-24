const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
require('dotenv').config();

const fileSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    imgUrl: {
        type: String,
    },
    vidUrl: {
        type: String
    },
    tags: {
        type: String,
    },
    email: {
        type: String,
    }
});

// doc = DB entry 
fileSchema.post("save", async function(doc){
    try{

        let transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PWD,
            },
        })

        let info = await transporter.sendMail({
            from: process.env.HOST_USER,
            to: doc.email,
            subject: "Test mail after uploading image to cloudinary",
            html: `<h2>Hello User</h2>`,
        })

    }catch(error){  
        console.log(error);

    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;