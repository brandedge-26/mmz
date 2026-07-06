import { Router } from "express";
import {
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  deleteAppointment,
  trackAppointment,
  getAppointmentStats,
} from "../controllers/appointment.controller.js";

const router = Router();

// Public
router.post("/",                    createAppointment);
router.get("/track/:trackingId",    trackAppointment);   // must be before /:id

// Admin
router.get("/stats",                getAppointmentStats);
router.get("/",                     getAllAppointments);
router.get("/:id",                  getAppointmentById);
router.patch("/:id/status",         updateAppointmentStatus);
router.delete("/:id",               deleteAppointment);

export default router;
