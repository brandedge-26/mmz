import { Notification } from "../models/notification.model.js";

export const notify = async ({ type, title, message, refId = null }) => {
  try {
    await Notification.create({ type, title, message, refId });
  } catch (_) {
    // Never crash the main request if notification fails
  }
};
