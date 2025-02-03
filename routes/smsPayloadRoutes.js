import { Router } from "express";
import {
  createSmsPayload,
  getByTypeFirebase,
  getByTypeTwilio,
  getSmsPayloads,
  updateFirebasePayload,
  updateTwilioPayload,
} from "../controllers/smsPayload.js";

const router = Router();

router.post("/sms-payloads", createSmsPayload);
router.get("/sms-payloads", getSmsPayloads);
router.get("/sms-payloads/twilio", getByTypeTwilio);
router.get("/sms-payloads/firebase", getByTypeFirebase);
router.put("/sms-payloads/firebase", updateFirebasePayload);
router.put("/sms-payloads/twilio", updateTwilioPayload);

export default router;
