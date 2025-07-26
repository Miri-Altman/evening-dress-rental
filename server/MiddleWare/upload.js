import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(req)
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        console.log(req)
        cb(null, Date.now() + '-' +path.extname(file.originalname));
    }
});
const upload=multer({storage:storage});
export default upload;