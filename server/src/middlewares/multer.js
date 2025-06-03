"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        if (file.fieldname === 'coverImg') {
            callback(null, 'temp/'); // Just for Cloudinary upload
        }
        else {
            callback(null, 'uploads/'); // Store video locally
        }
    },
    filename: function (req, file, callback) {
        if (file.fieldname === 'coverImg') {
            callback(null, file.originalname);
        }
        else {
            callback(null, `${Date.now()}${path_1.default.extname(file.originalname)}`);
        }
    }
});
const upload = (0, multer_1.default)({ storage });
exports.default = upload;
