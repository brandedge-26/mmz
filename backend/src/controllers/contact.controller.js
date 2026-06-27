import { Contact } from "../models/contact.model.js";

// POST /api/contact
export const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({
        success: false,
        message: "name and message are required.",
      });
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ success: false, message: "Invalid email address." });
      }
    }

    const contact = await Contact.create({ name, email, phone, subject, message });

    return res.status(201).json({
      success: true,
      message: "Message received. We'll get back to you shortly.",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = status ? { status } : {};
    const skip = (Number(page) - 1) * Number(limit);

    const [contacts, total] = await Promise.all([
      Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Contact.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: contacts,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/contact/:id
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/contact/:id/status
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const allowed = ["new", "read", "replied"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }

    return res.status(200).json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/contact/:id
export const deleteContact = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Message not found." });
    }
    return res.status(200).json({ success: true, message: "Message deleted." });
  } catch (err) {
    next(err);
  }
};
