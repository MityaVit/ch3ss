import express from "express";
import {
  sendEmailConfirmationEmail,
  sendPasswordRecoveryEmail,
  resetPassword,
  activateAccountHandler,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/password-recovery", sendPasswordRecoveryEmail);
router.post("/email-confirmation", sendEmailConfirmationEmail);
router.post("/password-reset", resetPassword);
router.get("/email-activation", activateAccountHandler);

export default router;
