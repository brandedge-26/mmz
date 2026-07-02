"use client";

import { useState, useRef, ChangeEvent } from "react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";
import {
  Plus, X, Upload, ImagePlus, Trash2, CheckCircle2, AlertCircle,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Cases", "Screen Protection", "Power & Charging", "Audio", "Accessories", "Panels"];
const BADGES     = ["None", "New", "Hot", "Sale", "Trending", "Best Seller"];
const BRANDS     = ["Apple", "Samsung", "Anker", "JBL", "Spigen", "ZAGG", "Belkin", "OnePlus", "Oppo", "Vivo", "Xiaomi", "Realme", "Other"];

interface Spec { key: string; value: string; }

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

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

function Field({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

const inputCls = "w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:bg-white transition-all text-gray-800 placeholder-gray-400";

export default function AddProductPage() {
  const [name,         setName]         = useState("");
  const [brand,        setBrand]        = useState("");
  const [category,     setCategory]     = useState(CATEGORIES[0]);
  const [badge,        setBadge]        = useState("None");
  const [price,        setPrice]        = useState("");
  const [strikePrice,  setStrikePrice]  = useState("");
  const [inStock,      setInStock]      = useState(true);
  const [trending,     setTrending]     = useState(false);
  const [newArrival,   setNewArrival]   = useState(false);
  const [description,  setDescription]  = useState("");
  const [colorInput,   setColorInput]   = useState("");
  const [colors,       setColors]       = useState<string[]>([]);
  const [features,     setFeatures]     = useState<string[]>([""]);
  const [specs,        setSpecs]        = useState<Spec[]>([{ key: "", value: "" }]);
  const [mainImage,    setMainImage]    = useState<string | null>(null);
  const [mainFile,     setMainFile]     = useState<File | null>(null);
  const [variantPreviews, setVariantPreviews] = useState<string[]>([]);
  const [variantFiles,    setVariantFiles]    = useState<File[]>([]);
  const [submitting,   setSubmitting]   = useState(false);
  const [toast,        setToast]        = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const mainRef    = useRef<HTMLInputElement>(null);
  const variantRef = useRef<HTMLInputElement>(null);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  function handleMainImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMainFile(file);
    const reader = new FileReader();
    reader.onload = () => setMainImage(reader.result as string);
    reader.readAsDataURL(file);
  }

  function handleVariantImages(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setVariantFiles((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setVariantPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  }

  function removeVariant(idx: number) {
    setVariantPreviews((p) => p.filter((_, i) => i !== idx));
    setVariantFiles((p) => p.filter((_, i) => i !== idx));
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
    if (!mainFile) { showToast("error", "Please upload a main product image."); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name",        name.trim());
      formData.append("brand",       brand.trim());
      formData.append("category",    category);
      formData.append("badge",       badge === "None" ? "" : badge);
      formData.append("price",       price);
      formData.append("originalPrice", strikePrice);
      formData.append("inStock",     String(inStock));
      formData.append("trending",    String(trending));
      formData.append("newArrival",  String(newArrival));
      formData.append("description", description.trim());
      formData.append("colors",      JSON.stringify(colors));
      formData.append("features",    JSON.stringify(features.filter((f) => f.trim())));
      formData.append("specifications", JSON.stringify(
        specs.filter((s) => s.key.trim() && s.value.trim())
      ));
      formData.append("image", mainFile);
      variantFiles.forEach((f) => formData.append("variantImages", f));

      await privateAxios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showToast("success", "Product added successfully!");
      setName(""); setBrand(""); setCategory(CATEGORIES[0]); setBadge("None");
      setPrice(""); setStrikePrice(""); setInStock(true); setTrending(false); setNewArrival(false);
      setDescription(""); setColors([]); setFeatures([""]); setSpecs([{ key: "", value: "" }]);
      setMainImage(null); setMainFile(null); setVariantPreviews([]); setVariantFiles([]);
    } catch {
      showToast("error", "Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Topbar title="Add Product" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-fade-in ${
          toast.type === "success" ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.type === "success"
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="p-4 lg:p-6 space-y-5">

          <div className="grid lg:grid-cols-3 gap-5">

            {/* ── Left column (2/3) ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Basic Info */}
              <SectionCard title="Basic Information">
                <div className="space-y-4">
                  <Field label="Product Name" required>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. iPhone 16 Pro Max Silicone Case"
                      className={inputCls}
                    />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
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
                      placeholder="Describe the product — materials, compatibility, key highlights…"
                      rows={4}
                      className={`${inputCls} resize-none`}
                    />
                  </Field>
                </div>
              </SectionCard>

              {/* Pricing */}
              <SectionCard title="Pricing">
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Selling Price (PKR)" required hint="The actual price customers pay">
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
                  <Field label="Strike-through Price (PKR)" hint="Original price shown crossed out (optional)">
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
                </div>
              </SectionCard>

              {/* Colors */}
              <SectionCard title="Colors">
                <div className="space-y-3">
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
              </SectionCard>

              {/* Features */}
              <SectionCard title="Features & Details">
                <div className="space-y-2">
                  {features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">{idx + 1}</span>
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
                    className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold mt-1"
                  >
                    <Plus className="w-4 h-4" /> Add feature
                  </button>
                </div>
              </SectionCard>

              {/* Specifications */}
              <SectionCard title="Specifications">
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
                    className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-semibold mt-1"
                  >
                    <Plus className="w-4 h-4" /> Add specification
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* ── Right column (1/3) ── */}
            <div className="space-y-5">

              {/* Status & Visibility */}
              <SectionCard title="Status & Visibility">
                <div className="space-y-4">
                  <Toggle checked={inStock}    onChange={setInStock}    label="In Stock" />
                  <Toggle checked={trending}   onChange={setTrending}   label="Trending" />
                  <Toggle checked={newArrival} onChange={setNewArrival} label="New Arrival" />
                  <div className="pt-1">
                    <Field label="Badge">
                      <select value={badge} onChange={(e) => setBadge(e.target.value)} className={inputCls}>
                        {BADGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
              </SectionCard>

              {/* Main Image */}
              <SectionCard title="Main Product Image">
                <div className="space-y-3">
                  {mainImage ? (
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mainImage} alt="Main" className="w-full h-full object-contain p-4" />
                      <button
                        type="button"
                        onClick={() => { setMainImage(null); setMainFile(null); if (mainRef.current) mainRef.current.value = ""; }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => mainRef.current?.click()}
                      className="w-full aspect-square rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2 hover:border-violet-400 hover:bg-violet-50 transition group"
                    >
                      <Upload className="w-8 h-8 text-gray-300 group-hover:text-violet-500 transition" />
                      <p className="text-sm text-gray-400 group-hover:text-violet-600 font-medium">Click to upload</p>
                      <p className="text-xs text-gray-300">PNG, JPG, WEBP</p>
                    </button>
                  )}
                  <input ref={mainRef} type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
                  {!mainImage && (
                    <button type="button" onClick={() => mainRef.current?.click()}
                      className="w-full py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-violet-400 hover:text-violet-600 transition flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4" /> Upload Image
                    </button>
                  )}
                </div>
              </SectionCard>

              {/* Variant Images */}
              <SectionCard title="Variant Images">
                <div className="space-y-3">
                  {variantPreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {variantPreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={src} alt={`Variant ${idx + 1}`} className="w-full h-full object-contain p-2" />
                          <button
                            type="button"
                            onClick={() => removeVariant(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => variantRef.current?.click()}
                    className="w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-violet-400 hover:text-violet-600 hover:bg-violet-50 transition flex items-center justify-center gap-2"
                  >
                    <ImagePlus className="w-4 h-4" /> Add Variant Images
                  </button>
                  <input ref={variantRef} type="file" accept="image/*" multiple className="hidden" onChange={handleVariantImages} />
                  <p className="text-xs text-gray-400">Upload multiple color/angle variants shown as thumbnails below the main image</p>
                </div>
              </SectionCard>
            </div>
          </div>

          {/* Submit bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-8 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-xl transition disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
              ) : (
                <><Plus className="w-4 h-4" /> Add Product</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
