const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        let destFolder;
        if (file.mimetype.startsWith('video')) {
            destFolder = 'uploads/videos/';
        } else {
            destFolder = 'uploads/files/';
        }
        cb(null, destFolder);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;
