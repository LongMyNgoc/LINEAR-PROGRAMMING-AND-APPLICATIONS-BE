const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../config/s3Config');

const fileUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'Không có file để upload' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileType = file.mimetype;
    const folderName = req.body.folderName || 'DefaultFolder'; // Lấy tên thư mục từ request, nếu không có thì dùng mặc định
    const filePath = `${folderName}/${fileName}`;

    try {
        // Chỉ upload file, không kiểm tra hoặc xóa file cũ
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

module.exports = fileUpload;
