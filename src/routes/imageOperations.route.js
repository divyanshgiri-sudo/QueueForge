import { Router } from "express";
import {changingImageType , settingImageSize} from '../controllers/imageOperation.controller.js'
import upload from "../middleware/mutler.middleware.js";

const router = Router();

router.route('/changeImgType').post(upload.single('userImage') , changingImageType)
router.route('/setImageSize').post(upload.single('userImage') , settingImageSize)

export default router