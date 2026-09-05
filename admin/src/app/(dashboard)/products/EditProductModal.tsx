"use client";

import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { privateAxios } from "@/lib/axios";
import {
  X, Plus, Upload, ImagePlus, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";

async function uploadToCloudinary(file: File, folder = "mmz/products"): Promise<string> {
  const { data } = await privateAxios.get(`/cloudinary/sign?folder=${encodeURIComponent(folder)}`);
  const form = new FormData();
  form.append("file",      file);
  form.append("timestamp", String(data.timestamp));
  form.append("signature", data.signature);
  form.append("api_key",   data.apiKey);
  form.append("folder",    data.folder);
  const res    = await fetch(`https://api.cloudinary.com/v1_1/${data.cloudName}/image/upload`, { method: "POST", body: form });
  const result = await res.json();
  if (!result.secure_url) throw new Error(result.error?.message || "Cloudinary upload failed");
  return result.secure_url;
}

const CATEGORIES = ["Cases", "Screen Protection", "Power & Charging", "Audio", "Accessories", "Panels"];
const BADGES     = ["None", "New", "Hot", "Sale", "Trending", "Best Seller"];
const BRANDS     = ["Apple", "Samsung", "Anker", "JBL", "Spigen", "ZAGG", "Belkin", "OnePlus", "Oppo", "Vivo", "Xiaomi", "Realme", "Other"];

interface Spec { key: string; value: string; }

export interface FullProduct {
  _id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  image: string;
  variantImages: string[];
  badge?: string;
  quantity?: number;
  inStock: boolean;
  trending: boolean;
  newArrival: boolean;
  colors: string[];
  description: string;
  features: string[];
  specifications: Spec[];
  status: "Active" | "Draft";
}

interface Props {
  productId: string | null;
  onClose: () => void;
  onSaved: (updated: FullProduct) => void;
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all text-gray-800 placeholder-gray-400";

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-violet-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </label>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 pt-1">{children}</h3>;
}

export default function EditProductModal({ productId, onClose, onSaved }: Props) {
  const [fetching,   setFetching]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [toast,      setToast]      = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Form fields
  const [name,        setName]        = useState("");
  const [brand,       setBrand]       = useState("");
  const [category,    setCategory]    = useState(CATEGORIES[0]);
  const [badge,       setBadge]       = useState("None");
  const [status,      setStatus]      = useState<"Active" | "Draft">("Active");
  const [price,       setPrice]       = useState("");
  const [strikePrice, setStrikePrice] = useState("");
  const [quantity,    setQuantity]    = useState("");
  const [inStock,     setInStock]     = useState(true);
  const [trending,    setTrending]    = useState(false);
  const [newArrival,  setNewArrival]  = useState(false);
  const [description, setDescription] = useState("");
  const [colorInput,  setColorInput]  = useState("");
  const [colors,      setColors]      = useState<string[]>([]);
  const [features,    setFeatures]    = useState<string[]>([""]);
  const [specs,       setSpecs]       = useState<Spec[]>([{ key: "", value: "" }]);

  // Images
  const [currentImage,      setCurrentImage]      = useState("");
  const [newMainFile,       setNewMainFile]        = useState<File | null>(null);
  const [newMainPreview,    setNewMainPreview]     = useState<string | null>(null);
  const [existingVariants,  setExistingVariants]   = useState<string[]>([]);
  const [removedVariants,   setRemovedVariants]    = useState<string[]>([]);
  const [newVariantFiles,   setNewVariantFiles]    = useState<File[]>([]);
  const [newVariantPreviews,setNewVariantPreviews] = useState<string[]>([]);

  const mainRef    = useRef<HTMLInputElement>(null);
  const variantRef = useRef<HTMLInputElement>(null);

  const loadProduct = useCallback(async (id: string) => {
    setFetching(true);
    setFetchError("");
    try {
      const res = await privateAxios.get(`/products/id/${id}`);
      const p: FullProduct = res.data.data;

      setName(p.name);
      setBrand(p.brand || "");
      setCategory(p.category);
      setBadge(p.badge || "None");
      setStatus(p.status);
      setPrice(String(p.price));
      setStrikePrice(p.originalPrice ? String(p.originalPrice) : "");
      setQuantity(p.quantity !== undefined ? String(p.quantity) : "");
      setInStock(p.inStock);
      setTrending(p.trending);
      setNewArrival(p.newArrival);
      setDescription(p.description || "");
      setColors(p.colors || []);
      setFeatures(p.features?.length ? p.features : [""]);
      setSpecs(p.specifications?.length ? p.specifications : [{ key: "", value: "" }]);
      setCurrentImage(p.image || "");
      setExistingVariants(p.variantImages || []);
      setRemovedVariants([]);
      setNewMainFile(null);
      setNewMainPreview(null);
      setNewVariantFiles([]);
      setNewVariantPreviews([]);
    } catch {
      setFetchError("Failed to load product data.");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (productId) loadProduct(productId);
  }, [productId, loadProduct]);

  // Lock background scroll while open
  useEffect(() => {
    document.body.style.overflow = productId ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [productId]);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function handleMainImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewMainFile(file);
    const reader = new FileReader();
    reader.onload = () => setNewMainPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleVariantImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setNewVariantFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setNewVariantPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeExistingVariant(url: string) {
    setExistingVariants((p) => p.filter((v) => v !== url));
    setRemovedVariants((p) => [...p, url]);
  }

  function removeNewVariant(idx: number) {
    setNewVariantFiles((p) => p.filter((_, i) => i !== idx));
    setNewVariantPreviews((p) => p.filter((_, i) => i !== idx));
  }

  function addColor() {
    const c = colorInput.trim();
    if (c && !colors.includes(c)) setColors((p) => [...p, c]);
    setColorInput("");
  }

  function addFeature() { setFeatures((p) => [...p, ""]); }
  function updateFeature(idx: number, val: string) { setFeatures((p) => p.map((f, i) => i === idx ? val : f)); }
  function removeFeature(idx: number) { setFeatures((p) => p.filter((_, i) => i !== idx)); }

  function addSpec() { setSpecs((p) => [...p, { key: "", value: "" }]); }
  function updateSpec(idx: number, field: "key" | "value", val: string) {
    setSpecs((p) => p.map((s, i) => i === idx ? { ...s, [field]: val } : s));
  }
  function removeSpec(idx: number) { setSpecs((p) => p.filter((_, i) => i !== idx)); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !price) { showToast("error", "Name and price are required."); return; }

    setSubmitting(true);
    try {
      // Upload new images directly to Cloudinary if changed
      const imageUrl = newMainFile ? await uploadToCloudinary(newMainFile) : undefined;
      const variantImageUrls = newVariantFiles.length
        ? await Promise.all(newVariantFiles.map((f) => uploadToCloudinary(f)))
        : [];

      const res = await privateAxios.patch(`/products/${productId}`, {
        name:             name.trim(),
        brand:            brand.trim(),
        category,
        badge:            badge === "None" ? "" : badge,
        status,
        price,
        originalPrice:    strikePrice,
        quantity,
        inStock:          String(inStock),
        trending:         String(trending),
        newArrival:       String(newArrival),
        description:      description.trim(),
        colors:           JSON.stringify(colors),
        features:         JSON.stringify(features.filter((f) => f.trim())),
        specifications:   JSON.stringify(specs.filter((s) => s.key.trim() && s.value.trim())),
        ...(imageUrl && { imageUrl }),
        ...(variantImageUrls.length && { variantImageUrls: JSON.stringify(variantImageUrls) }),
        ...(removedVariants.length  && { removeVariants:   JSON.stringify(removedVariants) }),
      });

      showToast("success", "Product updated successfully!");
      setTimeout(() => {
        onSaved(res.data.data);
        onClose();
      }, 1000);
    } catch {
      showToast("error", "Failed to update product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!productId) return null;

  const displayImage = newMainPreview || currentImage;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Edit Product</h2>
            {name && <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{name}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {fetching ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="flex-1 flex items-center justify-center text-red-500 text-sm px-6 text-center">
            {fetchError}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto flex flex-col">
            <div className="flex-1 p-6 space-y-6">

              {/* Basic Info */}
              <div>
                <SectionTitle>Basic Information</SectionTitle>
                <div className="space-y-4">
                  <Field label="Product Name" required>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product name"
                      className={inputCls}
                    />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Brand">
                      <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputCls}>
                        <option value="">Select brand</option>
                        {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </Field>
                    <Field label="Category" required>
                      <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </Field>
                  </div>
                  <Field label="Description">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Product description…"
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <SectionTitle>Pricing & Stock</SectionTitle>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Selling Price (PKR)" required>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">PKR</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0"
                        min={0}
                        className={`${inputCls} pl-12`}
                      />
                    </div>
                  </Field>
                  <Field label="Strike Price (PKR)">
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">PKR</span>
                      <input
                        type="number"
                        value={strikePrice}
                        onChange={(e) => setStrikePrice(e.target.value)}
                        placeholder="0"
                        min={0}
                        className={`${inputCls} pl-12`}
                      />
                    </div>
                  </Field>
                  <Field label="Quantity">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="0"
                      min={0}
                      className={inputCls}
                    />
                  </Field>
                </div>
              </div>

              {/* Status & Visibility */}
              <div>
                <SectionTitle>Status & Visibility</SectionTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Status">
                      <select value={status} onChange={(e) => setStatus(e.target.value as "Active" | "Draft")} className={inputCls}>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </Field>
                    <Field label="Badge">
                      <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls}>
                        {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="flex flex-wrap items-center gap-6">
                    <Toggle checked={inStock}    onChange={setInStock}    label="In Stock" />
                    <Toggle checked={trending}   onChange={setTrending}   label="Trending" />
                    <Toggle checked={newArrival} onChange={setNewArrival} label="New Arrival" />
                  </div>
                </div>
              </div>

              {/* Main Image */}
              <div>
                <SectionTitle>Main Product Image</SectionTitle>
                <div className="flex items-start gap-4">
                  <div className="w-28 h-28 rounded-xl bg-gray-50 border border-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {displayImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={displayImage} alt="Main" className="w-full h-full object-contain p-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => mainRef.current?.click()}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:border-violet-400 hover:text-violet-600 transition"
                    >
                      <Upload className="w-4 h-4" />
                      {newMainFile ? "Change Image" : "Replace Image"}
                    </button>
                    {newMainFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewMainFile(null);
                          setNewMainPreview(null);
                          if (mainRef.current) mainRef.current.value = "";
                        }}
                        className="text-xs text-red-500 hover:text-red-600 text-left"
                      >
                        Cancel replacement
                      </button>
                    )}
                    <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
                  </div>
                </div>
                <input ref={mainRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
              </div>

              {/* Variant Images */}
              <div>
                <SectionTitle>Variant Images</SectionTitle>
                <div className="space-y-3">
                  {(existingVariants.length > 0 || newVariantPreviews.length > 0) && (
                    <div className="flex flex-wrap gap-2">
                      {existingVariants.map((url, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} alt={`Variant ${idx + 1}`} className="w-full h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => removeExistingVariant(url)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                      {newVariantPreviews.map((src, idx) => (
                        <div key={`new-${idx}`} className="relative w-16 h-16 rounded-xl overflow-hidden bg-violet-50 border border-violet-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`New ${idx + 1}`} className="w-full h-full object-contain p-1" />
                          <button
                            type="button"
                            onClick={() => removeNewVariant(idx)}
                            className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                          <div className="absolute bottom-0.5 left-0.5 bg-violet-500 text-white text-[7px] px-1 rounded font-bold">NEW</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => variantRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-violet-400 hover:text-violet-600 transition"
                  >
                    <ImagePlus className="w-4 h-4" /> Add Variant Images
                  </button>
                  <input ref={variantRef} type="file" accept="image/*" multiple className="hidden" onChange={handleVariantImages} />
                </div>
              </div>

              {/* Colors */}
              <div>
                <SectionTitle>Colors</SectionTitle>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addColor(); } }}
                      placeholder="e.g. Black, Midnight Blue…"
                      className={`${inputCls} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl transition"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>
                  {colors.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {colors.map((c) => (
                        <span key={c} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold rounded-full">
                          {c}
                          <button type="button" onClick={() => setColors((p) => p.filter((x) => x !== c))}>
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div>
                <SectionTitle>Features</SectionTitle>
                <div className="space-y-2">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={f}
                        onChange={(e) => updateFeature(idx, e.target.value)}
                        placeholder={`Feature ${idx + 1}`}
                        className={`${inputCls} flex-1`}
                      />
                      {features.length > 1 && (
                        <button type="button" onClick={() => removeFeature(idx)} className="text-gray-400 hover:text-red-500 transition p-1">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Add feature
                  </button>
                </div>
              </div>

              {/* Specifications */}
              <div>
                <SectionTitle>Specifications</SectionTitle>
                <div className="space-y-2">
                  {specs.map((s, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={s.key}
                        onChange={(e) => updateSpec(idx, "key", e.target.value)}
                        placeholder="Key (e.g. Material)"
                        className={`${inputCls} flex-1`}
                      />
                      <input
                        type="text"
                        value={s.value}
                        onChange={(e) => updateSpec(idx, "value", e.target.value)}
                        placeholder="Value (e.g. Silicone)"
                        className={`${inputCls} flex-1`}
                      />
                      {specs.length > 1 && (
                        <button type="button" onClick={() => removeSpec(idx)} className="text-gray-400 hover:text-red-500 transition p-1">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addSpec}
                    className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold"
                  >
                    <Plus className="w-4 h-4" /> Add specification
                  </button>
                </div>
              </div>

            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex items-center justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving…
                  </>
                ) : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Toast (above drawer) */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[60] flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl text-sm font-semibold ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}
    </>
  );
}
