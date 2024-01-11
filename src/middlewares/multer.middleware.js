import multer from 'multer'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {    // cb--> callback
        cb(null, './public/temp')// file wil be kept at this location
    },

    filename: function (req, file, cb) {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.originalname)
        // + '-' + uniqueSuffix)
    }
})


export const upload = multer(
    {
        storage,
    }
);