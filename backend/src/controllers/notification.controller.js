import { Notification } from "../models/notification.model.js";

// GET /api/notifications  (admin)
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ success: true, notifications });
  } catch (err) { next(err); }
};

// GET /api/notifications/unread-count  (admin)
export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ read: false });
    return res.json({ success: true, count });
  } catch (err) { next(err); }
};

// PATCH /api/notifications/:id/read  (admin)
export const markRead = async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    return res.json({ success: true });
  } catch (err) { next(err); }
};

// PATCH /api/notifications/read-all  (admin)
export const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    return res.json({ success: true });
  } catch (err) { next(err); }
};

// DELETE /api/notifications/:id  (admin)
export const deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (err) { next(err); }
};

// DELETE /api/notifications  (admin)
export const deleteAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({});
    return res.json({ success: true });
  } catch (err) { next(err); }
};
