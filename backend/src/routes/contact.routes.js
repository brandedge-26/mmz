import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contact.controller.js";

const router = Router();

router.post("/",            createContact);
router.get("/",             getAllContacts);
router.get("/:id",          getContactById);
router.patch("/:id/status", updateContactStatus);
router.delete("/:id",       deleteContact);

export default router;
