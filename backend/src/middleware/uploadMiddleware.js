import multer from 'multer';
import path from 'path';
import fs from 'fs';

const avatarsDir = path.join(process.cwd(), 'uploads', 'avatars');

if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, avatarsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    const safeName = file.fieldname + '-' + Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith('image/')) {
    return cb(new Error('Solo se permiten imágenes'), false);
  }
  cb(null, true);
};

export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
