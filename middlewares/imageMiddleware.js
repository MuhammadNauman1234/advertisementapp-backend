const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/advertisement'); // Set the destination directory for storing files
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname); // Set a unique filename for each uploaded file
    },
  });
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024, // Example: 5MB maximum file size
    },
  });

  module.exports = upload;