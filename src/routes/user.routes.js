import express from "express";
import {
  signupController,
  loginController,
  refreshAccessToken,
  userLogout,
} from "../controllers/user.controllers.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/refreshtoken", refreshAccessToken);
router.get("/logout", userLogout);

export default router;
