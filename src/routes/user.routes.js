import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middeleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 }, // Handle avatar upload
    { name: "coverImages", maxCount: 1 }, // Handle multiple images upload
  ]), // Use multer middleware to handle file upload
  registerUser
);

export default router;
