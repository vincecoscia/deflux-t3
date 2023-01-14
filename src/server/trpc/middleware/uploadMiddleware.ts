import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

export function uploadMiddleware(req: any, res: any) {
    return new Promise<void>((resolve, reject) => {
        upload.single('file')(req, res, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

module.exports = uploadMiddleware;