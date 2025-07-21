import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'public', 'profile-pics');
        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Use user id and timestamp for uniqueness
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const uniqueName = `${base}-${Date.now()}${ext}`;
        cb(null, uniqueName);
    }
});

function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
}

const upload = multer({ storage, fileFilter });

export default upload; 