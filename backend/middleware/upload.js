import multer from 'multer';
import path from 'path';

// Use memory storage for direct buffer access to parse PDF text
const storage = multer.memoryStorage();

// File filter to allow only PDF files
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/pdf' || ext === '.pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF resume files (.pdf) are allowed!'), false);
  }
};

// Multer upload instance (max 5MB file size)
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export const uploadResumeMiddleware = upload.single('resume');
export default upload;
