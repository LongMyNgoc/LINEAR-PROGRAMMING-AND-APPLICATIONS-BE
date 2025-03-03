const express = require('express');
const cors = require('cors');
const fileRoutes = require('./src/routes/fileRoutes');

const app = express();

// Cấu hình CORS
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

// Sử dụng routes
app.use('/api', fileRoutes);

// Chạy server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
