const express = require('express');
const multer = require('multer');
const { listFiles, uploadFile, getFileByMSSV, deleteFileByMSSV, fileUpload } = require('../controllers/controller.js');

const router = express.Router();
const upload = multer();

// Các route cũ
router.get('/list-files', listFiles);
router.post('/upload', upload.single('file'), uploadFile);
router.post('/upload-file', upload.single('file'), fileUpload);

// Thêm route mới để lấy file theo mssv
router.get('/file/:mssv', getFileByMSSV);
router.delete('/delete-file/:mssv', deleteFileByMSSV);

module.exports = router;
