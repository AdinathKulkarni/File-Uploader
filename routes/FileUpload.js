const express = require('express');
const router = express.Router();

const {localFileUpload, imageUpload} = require('../controllers/FileUpload');

router.post("/localupload", localFileUpload);
router.post("/imageupload", imageUpload);

module.exports = router;