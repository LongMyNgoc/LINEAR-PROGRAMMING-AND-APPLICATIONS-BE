const { PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'Không có file để upload' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const folderName = 'TuLuanChuong1/';
    const filePath = `${folderName}${fileName}`;

    try {
        // Kiểm tra xem file cũ có tồn tại không
        const listParams = { Bucket: 'longmyngoc2004', Prefix: filePath };
        const listCommand = new ListObjectsV2Command(listParams);
        const listResponse = await s3.send(listCommand);

        if (listResponse.Contents && listResponse.Contents.length > 0) {
            console.log(`🔹 File ${fileName} đã tồn tại, đang xóa...`);
            const deleteParams = { Bucket: 'longmyngoc2004', Key: filePath };
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3.send(deleteCommand);
            console.log(`✅ File ${fileName} đã được xóa.`);
        }

        // Tiến hành upload file mới
        const uploadParams = {
            Bucket: 'longmyngoc2004',
            Key: filePath,
            Body: file.buffer,
            ContentType: fileType,
        };

        const uploadCommand = new PutObjectCommand(uploadParams);
        await s3.send(uploadCommand);

        return res.status(200).send({ 
            message: 'File uploaded successfully', 
            url: `https://${uploadParams.Bucket}.s3.amazonaws.com/${uploadParams.Key}` 
        });

    } catch (error) {
        console.error("❌ Lỗi khi upload file lên S3: ", error);
        return res.status(500).send({ error: 'Không thể upload file lên S3', details: error.message });
    }    
};

module.exports = uploadFile;
