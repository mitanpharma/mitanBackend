import express from "express";
import {
  signupController,
  loginController,
  refreshAccessToken,
  userLogout,
} from "../controllers/user.controllers.js";
import { userAuthenticationMiddleware, userAuthorization } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/signup", signupController);
router.post("/login", loginController);
router.get("/refreshtoken", refreshAccessToken);
router.post("/logout", userAuthenticationMiddleware,userAuthorization,userLogout);

export default router;
