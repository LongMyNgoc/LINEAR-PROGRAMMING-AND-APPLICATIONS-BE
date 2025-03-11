const { ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

const listFiles = async (req, res) => {
    try {
        const params = { Bucket: process.env.AWS_BUCKET_NAME };
        const command = new ListObjectsV2Command(params);
        const response = await s3.send(command);

        if (!response.Contents) {
            return res.status(200).json({ message: 'Bucket không có file nào', files: [] });
        }

        const files = response.Contents.map(file => ({
            key: file.Key,
            size: file.Size,
            lastModified: file.LastModified,
            url: `https://${params.Bucket}.s3.amazonaws.com/${file.Key}`
        }));

        res.status(200).json({ message: 'Danh sách file trong bucket', files });
    } catch (error) {
        res.status(500).json({ error: 'Không thể lấy danh sách file', details: error.message });
    }
};

module.exports = listFiles;
