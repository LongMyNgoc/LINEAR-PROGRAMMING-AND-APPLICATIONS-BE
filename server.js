const express = require('express');
const { S3Client, PutObjectCommand, ListBucketsCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const multer = require('multer');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const upload = multer();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

const s3 = new S3Client({
    region: 'ap-southeast-2',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Route kiểm tra kết nối với AWS S3
app.get('/api/check-s3', async (req, res) => {
    try {
        const command = new ListBucketsCommand({});
        const response = await s3.send(command);
        res.status(200).json({ message: 'Kết nối thành công', buckets: response.Buckets });
    } catch (error) {
        res.status(500).json({ error: 'Không thể kết nối đến S3', details: error.message });
    }
});

// Route hiển thị danh sách file trong bucket
app.get('/api/list-files', async (req, res) => {
    try {
        const params = {
            Bucket: 'longmyngoc2004',
        };
        const command = new ListObjectsV2Command(params);
        const response = await s3.send(command);

        // Kiểm tra nếu bucket rỗng
        if (!response.Contents) {
            return res.status(200).json({ message: 'Bucket không có file nào', files: [] });
        }

        // Tạo danh sách file với URL đầy đủ
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
});

// Route upload file lên S3
app.post('/api/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'Không có file để upload' });
    }

    const file = req.file;
    const fileName = file.originalname;
    const fileType = file.mimetype;

    const params = {
        Bucket: 'longmyngoc2004',
        Key: fileName,
        Body: file.buffer,
        ContentType: fileType,
    };
    
    try {
        const command = new PutObjectCommand(params);
        await s3.send(command);
        return res.status(200).send({ message: 'File uploaded successfully', url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}` });
    } catch (error) {
        console.error("Lỗi khi upload file lên S3: ", error);
        return res.status(500).send({ error: 'Không thể upload file lên S3', details: error.message });
    }    
});

// Chạy server trên cổng 5000
app.listen(5000, () => {
    console.log('Server đang chạy trên cổng 5000');
});
