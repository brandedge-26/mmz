import { Banner } from "../models/banner.model.js";

// GET /banners?type=desktop|mobile  (public)
export const getBanners = async (req, res) => {
  try {
    const filter = { active: true };
    if (req.query.type) filter.type = req.query.type;
    const banners = await Banner.find(filter).sort({ order: 1, createdAt: 1 });
    res.json({ banners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /banners/all  (admin — includes inactive)
export const getAllBanners = async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    const banners = await Banner.find(filter).sort({ type: 1, order: 1, createdAt: 1 });
    res.json({ banners });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /banners  (admin)
export const createBanner = async (req, res) => {
  try {
    const { type, imageUrl, href, label, order, tag, title, desc, btnText, bgColor } = req.body;
    const banner = await Banner.create({
      type, imageUrl,
      href: href || "", label: label || "",
      tag: tag || "", title: title || "", desc: desc || "",
      btnText: btnText || "", bgColor: bgColor || "#0f172a",
      order: order ?? 0,
    });
    res.status(201).json({ banner });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /banners/:id  (admin)
export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json({ banner });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /banners/:id  (admin)
export const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
