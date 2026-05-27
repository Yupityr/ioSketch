import express from "express";
import { register, login, signout } from "../controllers/authController.js";

const router = express.Router();


router.post("/signup", register);
router.post("/signin", login);
router.post("/signout", signout);

export default router;