const listFiles = require('./listFiles');
const uploadFile = require('./uploadFile');
const getFileByMSSV = require('./getFileByMSSV');
const deleteFileByMSSV = require('./deleteFileByMSSV');
const fileUpload = require('./fileUpload');

module.exports = { getFileByMSSV, uploadFile, listFiles, deleteFileByMSSV, fileUpload };
