const express = require('express');
const router = express.Router();

const {localFileUpload} = require('../controllers/FileUpload');

router.post("/localupload", localFileUpload);

module.exports = router;