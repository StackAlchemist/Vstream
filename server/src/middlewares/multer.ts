import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.fieldname === 'coverImg') {
      callback(null, 'temp/'); // Just for Cloudinary upload
    } else {
      callback(null, 'uploads/'); // Store video locally
    }
  },
  filename: function (req, file, callback) {
    if (file.fieldname === 'coverImg') {
      callback(null, file.originalname);
    } else {
      callback(null, `${Date.now()}${path.extname(file.originalname)}`);
    }
  }
});

const upload = multer({ storage });
export default upload;
