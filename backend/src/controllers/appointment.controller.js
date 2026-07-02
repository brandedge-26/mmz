import { Appointment } from "../models/appointment.model.js";

const genTrackingId = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "MMZ-";
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

// POST /api/appointments
export const createAppointment = async (req, res, next) => {
  try {
    const {
      category, brand, model,
      issues, otherIssueText,
      serviceType, zipCode, streetAddress,
      date, time,
      name, phone, email,
    } = req.body;

    // Basic validation
    if (!category || !brand || !issues?.length || !serviceType || !name || !phone) {
      return res.status(400).json({
        success: false,
        message: "category, brand, issues, serviceType, name and phone are required.",
      });
    }

    if (serviceType === "mail-in" && !zipCode) {
      return res.status(400).json({
        success: false,
        message: "zipCode is required for mail-in service.",
      });
    }

    if (serviceType === "visit-store" && (!streetAddress || !date || !time)) {
      return res.status(400).json({
        success: false,
        message: "streetAddress, date and time are required for visit-store service.",
      });
    }

    // Generate unique tracking ID
    let trackingId, exists = true;
    while (exists) {
      trackingId = genTrackingId();
      exists = !!(await Appointment.findOne({ trackingId }));
    }

    const appointment = await Appointment.create({
      category, brand, model,
      issues, otherIssueText,
      serviceType, zipCode, streetAddress,
      date, time,
      name, phone, email,
      trackingId,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully.",
      data: appointment,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments
export const getAllAppointments = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [appointments, total] = await Promise.all([
      Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Appointment.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: appointments,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/:id
export const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/appointments/:id/status
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    const allowed = ["pending", "confirmed", "in-progress", "completed", "cancelled"];
    if (status && !allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(notes !== undefined && { notes }) },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// GET /api/appointments/track/:trackingId  (public)
export const trackAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ trackingId: req.params.trackingId })
      .select("trackingId name phone email brand model category issues serviceType streetAddress zipCode date time notes status createdAt");
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found. Please check your tracking ID." });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/appointments/:id
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }
    return res.status(200).json({ success: true, message: "Appointment deleted." });
  } catch (err) {
    next(err);
  }
};
