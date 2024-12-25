const upload = require("./multer");
const uploadMiddleware = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: "File upload error" });
    }

    // Initialize an object to hold the combined data
    let data = { ...req.body };

    // If files are uploaded, set their URLs in the data object

    if (req.files) {
      req.files.forEach((file) => {
        if (file.fieldname.includes("[")) {
          const name = file.fieldname.split("[")[0];
          const fileUrl = `http://localhost:3002/media/img/${file.filename}`;
          if (data[name]) {
            data = { ...data, [name]: [...data?.[name], fileUrl] };
          } else {
            data = { ...data, [name]: [fileUrl] };
          }
        }
        // Assuming your server is hosted at 'http://localhost:3000'
        const fileUrl = `http://localhost:3002/media/img/${file.filename}`;
        data = { ...data, [file.fieldname]: fileUrl };
      });
    }

    // Attach the combined data to the request object
    req.body = data;

    // Proceed to the next middleware or route handler
    return next();
  });
};

module.exports = uploadMiddleware;
