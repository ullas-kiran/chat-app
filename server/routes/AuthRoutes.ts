import {Router} from  'express'
import { getUserInfo, login, signup, updateProfile,addProfileImage,removeProfileImage } from '../controllers/AuthController';
import { verifyToken } from '../middlewares/AuthMiddleware';
const multer  = require('multer')

const authRoutes = Router();
const upload = multer({ dest: 'uploads/profiles/' }) 

authRoutes.post('/signup',signup);
authRoutes.post('/login',login);
authRoutes.get('/user-info',verifyToken,getUserInfo);
authRoutes.post('/update-profile',verifyToken,updateProfile)
authRoutes.post('/add-profile-image',verifyToken,upload.single("profile-image"),addProfileImage);
authRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
export default authRoutes