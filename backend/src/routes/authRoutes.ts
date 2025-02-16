import express from "express";
import { login_user, register, logout } from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", (req, res, next) => {
	login_user(req, res).catch(next);
});
router.post("/logout", logout);

export default router;
