const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

const getFileByMSSV = async (req, res) => {
    const { mssv } = req.params;
    const { folderName } = req.query; // Nhận folder từ query parameters

    if (!folderName) {
        return res.status(400).json({ error: 'Thiếu tên thư mục' });
    }

    try {
        const params = {
            Bucket: 'longmyngoc2004',
            Prefix: `${folderName}/${mssv}`, // Dùng folderName động
        };

        const command = new ListObjectsV2Command(params);
        const response = await s3.send(command);

        if (!response.Contents || response.Contents.length === 0) {
            return res.status(404).json({ message: 'File không tồn tại' });
        }

        const file = response.Contents[0];
        const fileUrl = `https://${params.Bucket}.s3.amazonaws.com/${file.Key}`;

        res.status(200).json({
            message: 'File tìm thấy',
            fileUrl: fileUrl,
            fileName: file.Key.split('/').pop(),
            submissionDate: file.LastModified,
        });
    } catch (error) {
        res.status(500).json({ error: 'Không thể truy xuất file', details: error.message });
    }
};

module.exports = getFileByMSSV;
