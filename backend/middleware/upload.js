// backend/middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Siguraduhin na may folder na 'uploads' sa loob ng backend
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// 2. Storage Engine Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // Timestamp + Random Number para hindi magkapareho ang filenames
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

// 3. File Filter (Validation)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (ext && mime) {
        return cb(null, true);
    }
    cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
};

// 4. Multer Instance
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit sa 5 MB
});

// I-export ng diretso (hindi object)
module.exports = upload;