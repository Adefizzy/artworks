import multer from 'multer';

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});

const filterImg = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpeg|jpg|gif|png)$/i)) {
    cb(new Error('only image files are allowed'), false);
  }

  cb(null, true);
};

const upload = multer({ storage, fileFilter: filterImg });

export default upload;
