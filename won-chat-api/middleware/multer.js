const multer = require("multer");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "media/img");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const filename = `${file.originalname}-${uniqueSuffix}.${ext}`;
    cb(null, filename);
  },
});

module.exports = multer({ storage: multerStorage });
