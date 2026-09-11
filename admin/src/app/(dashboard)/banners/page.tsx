"use client";

import { useState, useEffect, useRef } from "react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";
import {
  ImagePlus, Trash2, Upload, Monitor, Smartphone,
  GripVertical, ToggleLeft, ToggleRight, ExternalLink,
  Loader2, Info, Pencil, X, AlertTriangle,
} from "lucide-react";

async function uploadToCloudinary(file: File): Promise<string> {
  const { data } = await privateAxios.get(`/cloudinary/sign?folder=mmz%2Fbanners`);
  const form = new FormData();
  form.append("file",      file);
  form.append("timestamp", String(data.timestamp));
  form.append("signature", data.signature);
  form.append("api_key",   data.apiKey);
  form.append("folder",    data.folder);
  const res    = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, { method: "POST", body: form });
  const result = await res.json();
  if (!result.secure_url) throw new Error(result.error?.message || "Upload failed");
  return result.secure_url;
}

interface Banner {
  _id: string; type: "desktop" | "mobile";
  imageUrl: string; href: string; label: string;
  tag: string; title: string; desc: string; btnText: string; bgColor: string;
  order: number; active: boolean;
}

const CATEGORY_LINKS = [
  { label: "All Products",         value: "/products" },
  { label: "Panels",               value: "/products?category=Panels" },
  { label: "Mobile Batteries",     value: "/products?category=Mobile+Batteries" },
  { label: "Charging Jacks",       value: "/products?category=Charging+Jacks" },
  { label: "Trending Accessories", value: "/products?category=Trending+Accessories" },
  { label: "Chargers",             value: "/products?category=Chargers" },
  { label: "Power Bank",           value: "/products?category=Power+Bank" },
  { label: "Casing Converter",     value: "/products?category=Casing+Converter" },
  { label: "Smart Watches",        value: "/products?category=Smart+Watches" },
  { label: "Car Accessories",      value: "/products?category=Car+Accessories" },
  { label: "Audio",                value: "/products?category=Audio" },
  { label: "Top Sellers",          value: "/top-sellers" },
  { label: "New Arrivals",         value: "/new-arrivals" },
  { label: "Trending",             value: "/trending" },
];

const inp = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

// ── Delete confirmation modal ──────────────────────────────────────────────────
function DeleteModal({ banner, onConfirm, onCancel, deleting }: {
  banner: Banner; onConfirm: () => void; onCancel: () => void; deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Delete Banner</h3>
              <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
            <img src={banner.imageUrl} alt="" className="w-16 h-10 rounded-lg object-cover shrink-0 border border-gray-200" />
            <p className="text-sm text-gray-700 font-medium truncate">{banner.title || banner.label || "Banner"}</p>
          </div>
          <div className="flex gap-2">
            <button onClick={onCancel} disabled={deleting}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={deleting}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting…</> : <><Trash2 className="w-4 h-4" /> Delete</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Edit modal ─────────────────────────────────────────────────────────────────
function EditModal({ banner, onSave, onClose }: {
  banner: Banner; onSave: (updated: Banner) => void; onClose: () => void;
}) {
  const [href, setHref]       = useState(CATEGORY_LINKS.find(l => l.value === banner.href) ? banner.href : "custom");
  const [customHref, setCustomHref] = useState(CATEGORY_LINKS.find(l => l.value === banner.href) ? "" : banner.href);
  const [label, setLabel]     = useState(banner.label);
  const [tag, setTag]         = useState(banner.tag);
  const [title, setTitle]     = useState(banner.title);
  const [desc, setDesc]       = useState(banner.desc);
  const [btnText, setBtnText] = useState(banner.btnText);
  const [bgColor, setBgColor] = useState(banner.bgColor || "#0f172a");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const finalHref = href === "custom" ? customHref : href;

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setNewFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleSave = async () => {
    setSaving(true); setError("");
    try {
      let imageUrl = banner.imageUrl;
      if (newFile) imageUrl = await uploadToCloudinary(newFile);
      const { data } = await privateAxios.put(`/banners/${banner._id}`, {
        imageUrl, href: finalHref, label, tag, title, desc, btnText, bgColor,
      });
      onSave(data.banner);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-bold text-gray-900 text-base flex items-center gap-2">
            <Pencil className="w-4 h-4 text-violet-600" /> Edit Banner
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Image */}
            <Field label="Banner Image">
              <div onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 transition-colors overflow-hidden bg-gray-50"
                style={{ aspectRatio: banner.type === "desktop" ? "3/1" : "8/5" }}>
                <img src={preview ?? banner.imageUrl} alt="" className="w-full h-full object-cover" />
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              <p className="text-[11px] text-gray-400 mt-1">Click image to replace</p>
            </Field>

            <div className="flex flex-col gap-4">
              <Field label="Link">
                <select value={href} onChange={(e) => setHref(e.target.value)} className={inp}>
                  {CATEGORY_LINKS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  <option value="custom">Custom URL…</option>
                </select>
                {href === "custom" && (
                  <input type="text" value={customHref} onChange={(e) => setCustomHref(e.target.value)}
                    placeholder="/products?category=..." className={`${inp} mt-2`} />
                )}
              </Field>
              <Field label="Internal Label">
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} className={inp} placeholder="e.g. Panels Banner" />
              </Field>
            </div>
          </div>

          {/* Text overlay fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Tag / Badge">
              <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} className={inp} placeholder="e.g. Premium Quality" />
            </Field>
            <Field label="Button Text">
              <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} className={inp} placeholder="e.g. Shop Now" />
            </Field>
            <Field label="Title">
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={inp} placeholder="e.g. Mobile Panels" />
            </Field>
            <Field label="Overlay Color">
              <div className="flex items-center gap-3">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className={`${inp} flex-1`} />
              </div>
            </Field>
            <Field label="Description">
              <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} className={inp} placeholder="Short subtitle…" />
            </Field>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={onClose} disabled={saving}
              className="flex-1 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 rounded-xl text-sm font-semibold text-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function BannersPage() {
  const [tab, setTab]             = useState<"desktop" | "mobile">("desktop");
  const [banners, setBanners]     = useState<Banner[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<Banner | null>(null);
  const [deleting, setDeleting]         = useState(false);
  const [editTarget, setEditTarget]     = useState<Banner | null>(null);

  // Upload form
  const [file, setFile]         = useState<File | null>(null);
  const [preview, setPreview]   = useState<string | null>(null);
  const [href, setHref]         = useState(CATEGORY_LINKS[0].value);
  const [customHref, setCustomHref] = useState("");
  const [label, setLabel]       = useState("");
  const [tag, setTag]           = useState("");
  const [title, setTitle]       = useState("");
  const [desc, setDesc]         = useState("");
  const [btnText, setBtnText]   = useState("Shop Now");
  const [bgColor, setBgColor]   = useState("#0f172a");
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered  = banners.filter((b) => b.type === tab);
  const finalHref = href === "custom" ? customHref : href;

  const fetchBanners = async () => {
    setLoading(true);
    try { const { data } = await privateAxios.get("/banners/all"); setBanners(data.banners); }
    catch { setError("Failed to load banners"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBanners(); }, []);

  const flash = (msg: string, type: "ok" | "err") => {
    if (type === "ok") { setSuccess(msg); setTimeout(() => setSuccess(""), 3500); }
    else               { setError(msg);   setTimeout(() => setError(""),   3500); }
  };

  const resetForm = () => {
    setFile(null); setPreview(null); setHref(CATEGORY_LINKS[0].value);
    setCustomHref(""); setLabel(""); setTag(""); setTitle("");
    setDesc(""); setBtnText("Shop Now"); setBgColor("#0f172a");
    if (fileRef.current) fileRef.current.value = "";
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f); setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) return flash("Please select an image first.", "err");
    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(file);
      await privateAxios.post("/banners", {
        type: tab, imageUrl, href: finalHref, label,
        tag, title, desc, btnText, bgColor,
        order: filtered.length,
      });
      resetForm(); await fetchBanners();
      flash("Banner uploaded!", "ok");
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : "Upload failed", "err");
    } finally { setUploading(false); }
  };

  const toggleActive = async (b: Banner) => {
    try {
      await privateAxios.put(`/banners/${b._id}`, { active: !b.active });
      setBanners((prev) => prev.map((x) => x._id === b._id ? { ...x, active: !x.active } : x));
    } catch { flash("Failed to update", "err"); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await privateAxios.delete(`/banners/${deleteTarget._id}`);
      setBanners((prev) => prev.filter((b) => b._id !== deleteTarget._id));
      flash("Banner deleted.", "ok");
      setDeleteTarget(null);
    } catch { flash("Failed to delete", "err"); }
    finally { setDeleting(false); }
  };

  const moveOrder = async (b: Banner, dir: -1 | 1) => {
    const list = [...filtered].sort((a, c) => a.order - c.order);
    const idx  = list.findIndex((x) => x._id === b._id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= list.length) return;
    const other = list[swapIdx];
    await Promise.all([
      privateAxios.put(`/banners/${b._id}`,     { order: other.order }),
      privateAxios.put(`/banners/${other._id}`, { order: b.order }),
    ]);
    setBanners((prev) => prev.map((x) => {
      if (x._id === b._id)     return { ...x, order: other.order };
      if (x._id === other._id) return { ...x, order: b.order };
      return x;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar title="Banner Management" />
      <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6">

        {success && <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-xl">{success}</div>}
        {error   && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        {/* Tabs */}
        <div className="flex gap-2">
          {(["desktop", "mobile"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                tab === t ? "bg-violet-600 text-white border-violet-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"
              }`}>
              {t === "desktop" ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
              {t === "desktop" ? "Desktop Banners" : "Mobile Banners"}
            </button>
          ))}
        </div>

        {/* Upload card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-violet-600" />
            Add New {tab === "desktop" ? "Desktop" : "Mobile"} Banner
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-violet-600 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 mb-5 w-fit">
            <Info className="w-3.5 h-3.5 shrink-0" />
            {tab === "desktop" ? "Recommended: 1400 × 480 px" : "Recommended: 400 × 250 px"}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <Field label="Banner Image *">
                <div onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-violet-400 transition-colors overflow-hidden bg-gray-50"
                  style={{ aspectRatio: tab === "desktop" ? "3/1" : "8/5" }}>
                  {preview
                    ? <img src={preview} alt="" className="w-full h-full object-cover" />
                    : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                        <Upload className="w-7 h-7" />
                        <span className="text-xs font-medium">Click to upload</span>
                        <span className="text-[11px]">{tab === "desktop" ? "1400 × 480 px" : "400 × 250 px"}</span>
                      </div>
                    )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
              </Field>
              <Field label="Internal Label">
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Power Bank Banner" className={inp} />
              </Field>
            </div>

            <div className="flex flex-col gap-4">
              <Field label="Link">
                <select value={href} onChange={(e) => setHref(e.target.value)} className={inp}>
                  {CATEGORY_LINKS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
                  <option value="custom">Custom URL…</option>
                </select>
                {href === "custom" && (
                  <input type="text" value={customHref} onChange={(e) => setCustomHref(e.target.value)}
                    placeholder="/products?category=..." className={`${inp} mt-2`} />
                )}
              </Field>

              <Field label="Tag / Badge" hint="Short label above title">
                <input type="text" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Premium Quality" className={inp} />
              </Field>
              <Field label="Title">
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Mobile Panels" className={inp} />
              </Field>
              <Field label="Description">
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={2} placeholder="Short subtitle…" className={inp} />
              </Field>
              <Field label="Button Text">
                <input type="text" value={btnText} onChange={(e) => setBtnText(e.target.value)} placeholder="e.g. Shop Now" className={inp} />
              </Field>
              <Field label="Overlay Color">
                <div className="flex items-center gap-3">
                  <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5" />
                  <input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} placeholder="#0f172a" className={`${inp} flex-1`} />
                </div>
              </Field>

              <button onClick={handleUpload} disabled={uploading || !file}
                className="mt-auto w-full py-3 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                {uploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Uploading…</> : <><Upload className="w-4 h-4" /> Upload Banner</>}
              </button>
            </div>
          </div>
        </div>

        {/* Banner list */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              {tab === "desktop" ? "Desktop" : "Mobile"} Banners
              <span className="ml-2 text-xs font-normal text-gray-400">({filtered.length} total)</span>
            </h2>
          </div>

          {loading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-violet-600" /></div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400 text-sm">No {tab} banners yet.</div>
          ) : (
            <div className="divide-y divide-gray-100">
              {[...filtered].sort((a, b) => a.order - b.order).map((b, idx, arr) => (
                <div key={b._id} className={`flex items-center gap-4 px-4 py-3 transition-opacity ${!b.active ? "opacity-50" : ""}`}>
                  {/* Order */}
                  <div className="flex flex-col gap-0.5 shrink-0 items-center">
                    <button onClick={() => moveOrder(b, -1)} disabled={idx === 0}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition rotate-180">
                      <GripVertical className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-gray-400">{idx + 1}</span>
                    <button onClick={() => moveOrder(b, 1)} disabled={idx === arr.length - 1}
                      className="p-0.5 text-gray-300 hover:text-gray-600 disabled:opacity-20 transition">
                      <GripVertical className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Thumb */}
                  <div className="w-28 h-14 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                    <img src={b.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{b.title || b.label || `Banner ${idx + 1}`}</p>
                    {b.tag && <p className="text-[11px] text-violet-500 font-medium">{b.tag}</p>}
                    <a href={b.href} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-violet-600 hover:underline truncate max-w-full">
                      <ExternalLink className="w-3 h-3 shrink-0" />{b.href || "No link"}
                    </a>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => toggleActive(b)} title={b.active ? "Deactivate" : "Activate"}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      {b.active ? <ToggleRight className="w-5 h-5 text-violet-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                    </button>
                    <button onClick={() => setEditTarget(b)} title="Edit"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteTarget(b)} title="Delete"
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete modal */}
      {deleteTarget && (
        <DeleteModal
          banner={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          deleting={deleting}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <EditModal
          banner={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(updated) => {
            setBanners((prev) => prev.map((b) => b._id === updated._id ? updated : b));
            setEditTarget(null);
            flash("Banner updated!", "ok");
          }}
        />
      )}
    </div>
  );
}
