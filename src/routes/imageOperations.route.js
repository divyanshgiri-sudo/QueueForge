import { Router } from "express";
import { changeImageType, setImageSize } from "../jobs/fixImage.js";
import upload from "../middleware/mutler.middleware.js";

const router = Router();

router.route('/setImageSize').post(upload.single('userImage') , setImageSize)
router.route('/setImageSize').post(upload.single('userImage') , changeImageType)

export default router