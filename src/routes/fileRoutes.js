const express = require('express');
const multer = require('multer');
const { listFiles, uploadFile } = require('../controllers/fileController.js');

const router = express.Router();
const upload = multer();

router.get('/list-files', listFiles);
router.post('/upload', upload.single('file'), uploadFile);

module.exports = router;
