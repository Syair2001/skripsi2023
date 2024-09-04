const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const filepath = 'uploads/'

    // if (file.mimetype.startsWith('csv/')) {
    //   uploadPath = 'uploads/csv/';
    // } else {
    //   uploadPath = 'uploads/img/'; 
    // }

    cb(null, filepath)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})

module.exports = upload