const { PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

// Lấy danh sách file trong bucket
const listFiles = async (req, res) => {
    try {
        const params = { Bucket: 'longmyngoc2004' };
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

// Upload file lên S3
const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'Không có file để upload' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const folderName = 'BaiTapChuong1/';
    const filePath = `${folderName}${fileName}`;

    const params = {
        Bucket: 'longmyngoc2004',
        Key: filePath,
        Body: file.buffer,
        ContentType: fileType,
    };

    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return res.status(200).send({ 
            message: 'File uploaded successfully', 
            url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` 
        });
    } catch (error) {
        console.error("Lỗi khi upload file lên S3: ", error);
        return res.status(500).send({ error: 'Không thể upload file lên S3', details: error.message });
    }    
};

module.exports = { listFiles, uploadFile };
