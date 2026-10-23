const express = require('express');
const router = express.Router();

const {localFileUpload, imageUpload, videoUpload} = require('../controllers/FileUpload');

router.post("/localupload", localFileUpload);
router.post("/imageupload", imageUpload);
router.post("/videoupload", videoUpload)

module.exports = router;