const express = require('express');
const router = express.Router();

const {localFileUpload, imageUpload, videoUpload, imageSizeReducer} = require('../controllers/FileUpload');

router.post("/localfile-upload", localFileUpload);
router.post("/image-upload", imageUpload);
router.post("/video-upload", videoUpload)
router.post("/size-reducer", imageSizeReducer)

module.exports = router;