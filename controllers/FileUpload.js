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

async function uploadFileToCloudinary(file, folder, quality) {
    const options = {folder};
    options.resource_type = "auto";

    if(quality){
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async(req, res) => {
    try{
        const {name, tags, email} = req.body;
        const imgFile = req.files && req.files.imageFile;

        //can be ignored
        if(typeof name !== 'string' || !name.trim()){
            return res.status(400).json({
                success: false,
                message: "A name is required",
            });
        }

        if(!imgFile || Array.isArray(imgFile) || !Buffer.isBuffer(imgFile.data)){
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

        const uploadResult = await uploadFileToCloudinary(imgFile, "file-uploader");
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

exports.videoUpload = async(req, res) => {
    try{
        const {name, tags, email} = req.body;
        const vidFile = req.files && req.files.videoFile;

        if(typeof name !== 'string' || !name.trim()){
            return res.status(400).json({
                success: false,
                message: "A name is required",
            });
        }

        if(!vidFile || Array.isArray(vidFile) || !Buffer.isBuffer(vidFile.data) || vidFile.data.length === 0){
            return res.status(400).json({
                success: false,
                message: "A video file is required",
            });
        }

        //check if file is supported or not
        const supportedFileType = ["mp4", "mov"];
        const fileType = path.extname(vidFile.name).slice(1).toLowerCase();

        if(!isFileTypeSupported(fileType, supportedFileType)){
            return res.status(400).json({
                success: false,
                message: "File type not supported",
            });
        }

        const uploadResult = await uploadFileToCloudinary(vidFile, "videos");
        if(!uploadResult.secure_url){
            throw new Error('Cloudinary returned no secure video URL');
        }

        const savedFile = await File.create({
            name: name.trim(),
            tags,
            email,
            vidUrl: uploadResult.secure_url,
        });

        return res.status(201).json({
            success: true,
            message: "Video uploaded successfully",
            data: savedFile,
        });
    } catch(error){
        console.error("Image upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Video not uploaded, Please try again !!",
        });
    }
}

exports.imageSizeReducer = async(req, res) => {
    try{

        const {name, email, tags } = req.body;
        const imageFile = req.files.imageFile;

        //supported file type array
        const supportedFileTypes = ["jpg", "jpeg", "png"];
        
        //get the extension
        const fileType = imageFile.name.split('.')[1].toLowerCase();

        if(!isFileTypeSupported(fileType, supportedFileTypes)){
            return res.status(400).json({
                success: false,
                message: "File type not supported, Please upload a jpg | jpeg | png file",
            })
        }

        const uploadImgFile = await uploadFileToCloudinary(imageFile, "file-uploader", 10);

        if(!uploadImgFile.secure_url){
            throw new Error('Cloudinary returned no secure image URL');
        }

        const compressedSavedfile = await File.create({
            name: name.trim(),
            tags,
            email,
            imgFile: (await uploadImgFile).secure_url
        })

        return res.status(201).json({
            success: true,
            message: "Image is compressed and uploaded successfully",
            data: compressedSavedfile,
        })
    }catch(error){
        console.error("Image upload failed:", error);
        return res.status(500).json({
            success: false,
            message: "Image not uploaded, Please try again !!",
        });
    }
}