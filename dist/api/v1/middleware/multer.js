var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import multer from "multer";
import path from "path";
import fs from "fs/promises";
const allowedVideoTypes = ["video/mp4"];
const allowedThumbnailTypes = ["image/jpeg", "image/png"];
// Define storage with async directory creation
const storage = multer.diskStorage({
    destination: (_, __, cb) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const uploadPath = path.join(process.cwd(), "uploads"); // Use process.cwd() to resolve the path
            yield fs.mkdir(uploadPath, { recursive: true }); // Ensure the directory exists
            return cb(null, uploadPath);
        }
        catch (err) {
            return cb(err, "");
        }
    }),
    filename: (_, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const ext = path.extname(file.originalname);
        return cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
});
// Initialize multer with the defined storage and file filter
// and file size limit
const upload = multer({
    storage,
    limits: {
        fileSize: 500 * 1024 * 1024, // Max 500MB
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "video") {
            if (!allowedVideoTypes.includes(file.mimetype)) {
                return cb(new Error("Only MP4 video files are allowed"));
            }
        }
        if (file.fieldname === "thumbnail") {
            if (!allowedThumbnailTypes.includes(file.mimetype)) {
                return cb(new Error("Only JPEG or PNG thumbnails are allowed"));
            }
        }
        cb(null, true);
    },
});
export const uploadFields = upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
]);
//# sourceMappingURL=multer.js.map