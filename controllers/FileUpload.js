const File = require('../models/File');

//localFileUpload
exports.localFileUpload = async(req, res) => {
    //for other atributes, we can directly destructure them from req
    //for file, use --> "req.files.file"
    const file = req.files.file;
    console.log("File recieved : ",file)

    const path = __dirname + "/files/" + Date.now() +`.${file.name.split('.')[1]}` ;  //__dirname --> represent the current directory

    file.mv(path, (err) => {
        console.log(err);
    });

    res.json({
        success: true,
        message: "local file uploaded ✅"
    });
}