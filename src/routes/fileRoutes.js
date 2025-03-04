const express = require('express');
const multer = require('multer');
const { listFiles, uploadFile, getFileByMSSV } = require('../controllers/filecontroller.js');

const router = express.Router();
const upload = multer();

// Các route cũ
router.get('/list-files', listFiles);
router.post('/upload', upload.single('file'), uploadFile);

// Thêm route mới để lấy file theo mssv
router.get('/file/:mssv', getFileByMSSV);

module.exports = router;
