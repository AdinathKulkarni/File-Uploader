const File = require('../models/File');
const cloudinary = require('cloudinary').v2;
const path = require('path');

//localFileUpload
exports.localFileUpload = async(req, res) => {
    try{
        //for other atributes, we can directly destructure them from req
        //for file, use --> "req.files.file"
        const file = req.files.file;
        console.log("File recieved : ",file);

        //__dirname --> represent the current directory
        const path = __dirname + "/files/" + Date.now() +`.${file.name.split('.')[1]}`;

        file.mv(path, (err) => {
            console.log(err);
        });

        res.json({
            success: true,
            message: "local file uploaded ✅"
        });
    } catch(error){
        console.log("Error while Uploading the file...");
    }
}

const isFileTypeSupported = (type, supportedFileType) => {
    return supportedFileType.includes(type);
}

const uploadToCloud = (file) => new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image' },
        (error, result) => {
            if (error) {
                reject(error);
            } else if (!result) {
                reject(new Error('Cloudinary returned no upload result'));
            } else {
                resolve(result);
            }
        }
    );

    uploadStream.end(file.data);
});

exports.imageUpload = async(req, res) => {
    try{
        const {name, tags, email} = req.body;
        const imgFile = req.files && req.files.imageFile;

        if(typeof name !== 'string' || !name.trim()){
            return res.status(400).json({
                success: false,
                message: "A name is required",
            });
        }

        if(!imgFile || Array.isArray(imgFile) || !Buffer.isBuffer(imgFile.data) || imgFile.data.length === 0){
            return res.status(400).json({
                success: false,
                message: "An image file is required",
            });
        }

        //check if file is supported or not
        const supportedFileType = ["jpg", "jpeg", "png"];
        const fileType = path.extname(imgFile.name).slice(1).toLowerCase();

        if(!isFileTypeSupported(fileType, supportedFileType)){
            return res.status(400).json({
                success: false,
                message: "File type not supported",
            });
        }

        const uploadResult = await uploadToCloud(imgFile);
        if(!uploadResult.secure_url){
            throw new Error('Cloudinary returned no secure image URL');
        }

        const savedFile = await File.create({
            name: name.trim(),
            tags,
            email,
            imgUrl: uploadResult.secure_url,
        });

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: savedFile,
        });
    } catch(error){
        console.error("Image upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Image not uploaded, Please try again !!",
        });
    }
}