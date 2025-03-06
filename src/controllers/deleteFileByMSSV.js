const { ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

const deleteFileByMSSV = async (req, res) => {
    const { mssv } = req.params;
    const { folderName } = req.query; // Nhận folder từ query parameters

    if (!folderName) {
        return res.status(400).json({ error: 'Thiếu tên thư mục' });
    }

    try {
        // Tìm file có tên trùng với MSSV trong thư mục
        const listParams = {
            Bucket: 'longmyngoc2004',
            Prefix: `${folderName}/`, // Chỉ lấy file trong thư mục này
        };

        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3.send(listCommand);

        if (!listResponse.Contents || listResponse.Contents.length === 0) {
            return res.status(404).json({ message: 'Thư mục rỗng hoặc không tồn tại file' });
        }

        // Tìm file có tên chính xác là MSSV
        const fileToDelete = listResponse.Contents.find(file => file.Key === `${folderName}/${mssv}`);

        if (!fileToDelete) {
            return res.status(404).json({ message: 'File không tồn tại' });
        }

        // Xóa file
        const deleteParams = {
            Bucket: 'longmyngoc2004',
            Key: fileToDelete.Key,
        };

        const deleteCommand = new DeleteObjectCommand(deleteParams);
        await s3.send(deleteCommand);

        return res.status(200).json({
            message: 'File đã được xóa thành công',
            deletedFile: fileToDelete.Key,
        });

    } catch (error) {
        return res.status(500).json({ error: 'Không thể xóa file', details: error.message });
    }
};

module.exports = deleteFileByMSSV;
