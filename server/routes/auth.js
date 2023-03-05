import express from "express";
import { login, logout, refresh } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.post("/refresh", refresh);

export default router;