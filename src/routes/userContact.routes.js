import express from "express";
import {
  allUserMessage,
  userContactController,
} from "../controllers/Contact.controller.js";
import { userAuthenticationMiddleware, userAuthorization } from "../middlewares/user.middleware.js";

const router = express.Router();

router.post("/contact", userContactController);
router.get("/contact/all",userAuthenticationMiddleware,userAuthorization, allUserMessage);

export default router;
