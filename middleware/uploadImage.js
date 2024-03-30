const multer = require("multer");
const fs = require("fs");

const directory = "./public/assets";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(directory, { recursive: true }, (err) => {
      if (err) {
        console.log(err.message);
      }
    });
    cb(null, directory);
  },

  filename: (req, file, cb) => {
    console.log(file);
    const rename = Date.now() + "-" + file.originalname;
    req.imageName = rename;
    cb(null, rename);
  },
});

//console.log(storage);

//*Error in this below function - Even we have the filename it gives 'No File Uploaded' error
// const uploadImageMiddleW = (req, res, next) => {
//   // Check if a file is provided
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   multer({ storage: storage }).single("image")(req, res, (err) => {
//     if (err instanceof multer.MulterError) {
//       // A Multer error occurred when uploading.
//       return res.status(500).json({ error: "Error uploading file" });
//     } else if (err) {
//       // An unknown error occurred.
//       return res.status(500).json({ error: "Unknown error occurred" });
//     }
//     next();
//   });
// };

const uploadImageMiddleW = multer({ storage: storage }).single("image");

module.exports = {
  uploadImageMiddleW,
};
