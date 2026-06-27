import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
} from "../controllers/appointment.controller.js";

const router = Router();

router.post("/",           createAppointment);
router.get("/",            getAllAppointments);
router.get("/:id",         getAppointmentById);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id",      deleteAppointment);

export default router;
