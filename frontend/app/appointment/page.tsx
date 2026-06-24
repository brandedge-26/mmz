"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  Check, ChevronLeft, ChevronDown, Calendar, Clock,
  User, Phone, Mail, CheckCircle2, Wrench,
  Zap, ShieldCheck, BadgeDollarSign, MessageCircle, HelpCircle,
  MapPin, Navigation, Package, Store,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = "Phone" | "iPad" | "Tablet" | "Accessories";

// ─── Brand image map ─────────────────────────────────────────────────────────

const BRAND_IMAGES: Record<string, string> = {
  Apple:          "/appoinments/brands/apple.svg",
  Samsung:        "/appoinments/brands/samsung.svg",
  "Google Pixel": "/appoinments/brands/gooogle-pixel.svg",
  Motorola:       "/appoinments/brands/motorola-real.svg",
  OnePlus:        "/appoinments/brands/oneplus.svg",
  Oppo:           "/appoinments/brands/oppo.svg",
  Realme:         "/appoinments/brands/realme.svg",
  Infinix:        "/appoinments/brands/infinix.svg",
  Lenovo:         "/appoinments/brands/lenovo.svg",
  Huawei:         "/appoinments/brands/huawei.png",
  Xiaomi:         "/appoinments/brands/xiaomi.svg",
  Tecno:          "/appoinments/brands/tecno.svg",
  Vivo:           "/appoinments/brands/vivo.svg",
};

// ─── Device & model data ─────────────────────────────────────────────────────

const DEVICES: { cat: Category; label: string; image: string; desc: string }[] = [
  { cat: "Phone",       label: "Phone",       image: "/appoinments/device-select/iphone.webp",    desc: "Smartphones" },
  { cat: "iPad",        label: "iPad",        image: "/appoinments/device-select/ipad.webp",      desc: "Apple iPad" },
  { cat: "Tablet",      label: "Tablet",      image: "/header-images/tech-repair/tablet.png",     desc: "Android / Windows" },
  { cat: "Accessories", label: "Accessories", image: "/home/services/earbuds-service.jpg",        desc: "Earbuds & more" },
];

type DeviceData = { brands: string[]; models: Record<string, string[]> };

const DEVICE_DATA: Record<Category, DeviceData> = {
  Phone: {
    brands: ["Apple","Samsung","Motorola","Google Pixel","Vivo","Xiaomi","Infinix","Realme","Oppo","OnePlus","Tecno"],
    models: {
      Apple: [
        "iPhone 16 Pro Max","iPhone 16 Pro","iPhone 16 Plus","iPhone 16",
        "iPhone 15 Pro Max","iPhone 15 Pro","iPhone 15 Plus","iPhone 15",
        "iPhone 14 Pro Max","iPhone 14 Pro","iPhone 14 Plus","iPhone 14",
        "iPhone 13 Pro Max","iPhone 13 Pro","iPhone 13 Mini","iPhone 13",
        "iPhone 12 Pro Max","iPhone 12 Pro","iPhone 12 Mini","iPhone 12",
        "iPhone 11 Pro Max","iPhone 11 Pro","iPhone 11",
        "iPhone XS Max","iPhone XR","iPhone X",
        "iPhone SE (3rd Gen)","iPhone SE (2nd Gen)",
      ],
      Samsung: [
        "Galaxy S25 Ultra","Galaxy S25+","Galaxy S25",
        "Galaxy S24 Ultra","Galaxy S24+","Galaxy S24","Galaxy S24 FE",
        "Galaxy S23 Ultra","Galaxy S23+","Galaxy S23","Galaxy S23 FE",
        "Galaxy S22 Ultra","Galaxy S22+","Galaxy S22",
        "Galaxy A55","Galaxy A35","Galaxy A25","Galaxy A15","Galaxy A05",
        "Galaxy A54","Galaxy A34","Galaxy A24","Galaxy A14",
        "Galaxy Note 20 Ultra","Galaxy Note 20",
        "Galaxy Z Fold 6","Galaxy Z Fold 5","Galaxy Z Flip 6","Galaxy Z Flip 5",
      ],
      Motorola: [
        "Moto G85","Moto G84","Moto G54","Moto G34","Moto G14",
        "Edge 50 Pro","Edge 50 Fusion","Edge 40 Pro","Edge 40",
        "Razr 50 Ultra","Razr 50",
      ],
      "Google Pixel": [
        "Pixel 9 Pro XL","Pixel 9 Pro Fold","Pixel 9 Pro","Pixel 9",
        "Pixel 8 Pro","Pixel 8a","Pixel 8",
        "Pixel 7 Pro","Pixel 7a","Pixel 7",
        "Pixel 6 Pro","Pixel 6a","Pixel 6",
      ],
      Vivo: [
        "Y28s 5G","Y28","Y18s","Y18","Y17s","Y16",
        "V30 Pro","V30 Lite","V30","V27 Pro","V27",
        "X100 Ultra","X100 Pro","X100",
      ],
      Xiaomi: [
        "Redmi Note 13 Pro+ 5G","Redmi Note 13 Pro","Redmi Note 13",
        "Redmi Note 12 Pro+","Redmi Note 12 Pro","Redmi Note 12",
        "Redmi 13C","Redmi 12C","Redmi 12","Redmi A3",
        "Poco X6 Pro","Poco X6","Poco X5 Pro","Poco X5",
        "Xiaomi 14 Ultra","Xiaomi 14","Xiaomi 13T Pro","Xiaomi 13T",
      ],
      Infinix: [
        "Hot 40 Pro","Hot 40i","Hot 40","Hot 30 Play","Hot 30",
        "Note 40 Pro+ 5G","Note 40 Pro","Note 40",
        "Note 30 Pro","Note 30 VIP","Note 30",
        "Smart 8 Plus","Smart 8 Pro","Smart 8","Smart 7",
      ],
      Realme: [
        "C65 5G","C65","C55","C53","C51","C35",
        "Note 50s","Note 50",
        "GT 6 Pro","GT 6","GT 5 Pro","GT 5",
        "Narzo 70 Pro","Narzo 70 Turbo","Narzo 70",
      ],
      Oppo: [
        "A3 Pro","A3","A78","A58","A38","A17",
        "Reno 12 Pro","Reno 12","Reno 11 Pro","Reno 11",
        "Reno 10 Pro+","Reno 10 Pro","Reno 10","Reno 8T",
        "Find X8 Pro","Find X7 Pro",
      ],
      OnePlus: [
        "13R","13","12R","12","11R","11",
        "Nord CE 4 Lite","Nord CE 4","Nord CE 3 Lite","Nord CE 3",
        "Nord 4","Nord 3","10T","10 Pro",
      ],
      Tecno: [
        "Spark 20 Pro+ 5G","Spark 20 Pro","Spark 20C","Spark 20",
        "Camon 30 Pro","Camon 30","Camon 20 Pro","Camon 20",
        "Phantom X2 Pro","Phantom X2","Pop 8 Pro","Pop 8","Pop 7 Pro",
      ],
    },
  },
  iPad: {
    brands: ["Apple"],
    models: {
      Apple: [
        'iPad Pro 13" (M4, 2024)','iPad Pro 11" (M4, 2024)',
        'iPad Air 13" (M2, 2024)','iPad Air 11" (M2, 2024)',
        "iPad (10th Gen, 2022)","iPad (9th Gen, 2021)",
        "iPad Mini 7 (2024)","iPad Mini 6 (2021)",
        'iPad Pro 12.9" (M2, 2022)','iPad Pro 11" (M2, 2022)',
        "iPad Air (5th Gen)","iPad Air (4th Gen)",
      ],
    },
  },
  Tablet: {
    brands: ["Samsung","Lenovo","Huawei","Xiaomi"],
    models: {
      Samsung: [
        "Galaxy Tab S9 Ultra","Galaxy Tab S9+","Galaxy Tab S9","Galaxy Tab S9 FE",
        "Galaxy Tab S8 Ultra","Galaxy Tab S8+","Galaxy Tab S8",
        "Galaxy Tab A9+","Galaxy Tab A9","Galaxy Tab A8","Galaxy Tab A7 Lite",
      ],
      Lenovo: [
        "Tab P12 Pro","Tab P12","Tab P11 Pro Gen 2","Tab P11 Gen 2","Tab P11 Plus",
        "Tab M10 Plus Gen 3","Tab M10 Plus","Tab M10 FHD Plus",
        "Tab M8 (4th Gen)","Tab M8 Gen 3","IdeaPad Duet 5 Chromebook",
      ],
      Huawei: [
        'MatePad Pro 13.2"','MatePad Pro 12.6"','MatePad 11.5"',
        'MatePad SE 10.4"',"MediaPad M6","MediaPad T5",
      ],
      Xiaomi: [
        "Pad 6 Pro","Pad 6","Pad 5 Pro","Pad 5",
        "Redmi Pad Pro","Redmi Pad SE","Redmi Pad",
      ],
    },
  },
  Accessories: {
    brands: ["Earbuds","SmartWatches","Headphones","Audio Speakers"],
    models: {
      Earbuds: [
        "AirPods Pro (2nd Gen)","AirPods (3rd Gen)","AirPods (2nd Gen)",
        "Samsung Galaxy Buds 2 Pro","Samsung Galaxy Buds 2","Samsung Galaxy Buds FE",
        "OnePlus Buds Pro 2","OnePlus Buds 3",
        "Xiaomi Buds 4 Pro","Oppo Enco X2","Oppo Enco Air 3 Pro",
        "JBL Live Pro 2 TWS","JBL Tune Flex","Sony WF-1000XM5",
      ],
      SmartWatches: [
        "Apple Watch Ultra 2","Apple Watch Series 9","Apple Watch SE (2nd Gen)","Apple Watch Series 8",
        "Samsung Galaxy Watch 6 Classic","Samsung Galaxy Watch 6",
        "Samsung Galaxy Watch 5 Pro","Samsung Galaxy Watch 5",
        "Xiaomi Watch S3","Huawei Watch GT 4","Oppo Watch 4 Pro","OnePlus Watch 2",
      ],
      Headphones: [
        "Sony WH-1000XM5","Sony WH-1000XM4","Samsung Galaxy Buds Live",
        "JBL Tune 770NC","JBL Club One","Beats Studio Pro","Beats Studio 3",
        "Bose QuietComfort 45","Bose 700","Xiaomi Headphones 2 Pro",
      ],
      "Audio Speakers": [
        "JBL Flip 6","JBL Charge 5","JBL Go 3","JBL Xtreme 3",
        "Sony SRS-XB43","Sony SRS-XB33",
        "Marshall Emberton III","Marshall Emberton II",
        "Xiaomi Mi Portable Bluetooth Speaker 2","Anker Soundcore Motion+",
      ],
    },
  },
};

const ISSUES = [
  "Cracked Screen","Battery Replacement","Charging Port","Water Damage",
  "Camera Repair","Speaker Issue","Microphone Issue","Won't Turn On",
  "Software Issue","Back Cover Damage","Overheating","Button Repair",
];

// Mon–Sat: 1:00 PM – 11:00 PM  (last slot 10 PM, 1hr before close)
const MON_SAT_SLOTS = [
  "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM",
  "6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM",
];

// Sunday: 10:00 AM – 12:00 AM  (last slot 11 PM, 1hr before midnight close)
const SUNDAY_SLOTS = [
  "10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM",
  "3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM",
  "8:00 PM","9:00 PM","10:00 PM","11:00 PM",
];

const STEPS_VISIT  = ["Device","Issues","Service","Schedule","Details"];
const STEPS_MAILIN = ["Device","Issues","Service","Details"];

function getAvailableDates(): Date[] {
  const dates: Date[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (dates.length < 14) {
    dates.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

function isSunday(dateLabel: string): boolean {
  return dateLabel.startsWith("Sun");
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AppointmentPage() {
  const [step, setStep]                         = useState(1);

  // Step 1 — device
  const [category, setCategory]                 = useState<Category | "">("");
  const [brand, setBrand]                       = useState("");
  const [model, setModel]                       = useState("");
  const [otherBrandText, setOtherBrandText]     = useState("");
  const [otherModelText, setOtherModelText]     = useState("");

  // Step 2 — issues
  const [selectedIssues, setSelectedIssues]     = useState<string[]>([]);

  // Step 3 — service type
  const [serviceType, setServiceType]           = useState<"mail-in" | "visit-store" | "">("");
  const [zipCode, setZipCode]                   = useState("");
  const [locationDisplay, setLocationDisplay]   = useState("");
  const [locationLoading, setLocationLoading]   = useState(false);
  const [locationError, setLocationError]       = useState("");
  const [streetAddress, setStreetAddress]       = useState("");
  const [otherIssueText, setOtherIssueText]     = useState("");

  // Step 4 — schedule
  const [date, setDate]                         = useState("");
  const [time, setTime]                         = useState("");

  // Step 5 — details
  const [name, setName]                         = useState("");
  const [phone, setPhone]                       = useState("");
  const [email, setEmail]                       = useState("");

  const [submitted, setSubmitted]               = useState(false);

  // Geolocation
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationDisplay(`${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        setZipCode("");
        setLocationLoading(false);
      },
      () => {
        setLocationError("Could not get location. Please enter your area manually.");
        setLocationLoading(false);
      }
    );
  };

  const availableDates = getAvailableDates();
  const data           = category ? DEVICE_DATA[category] : null;
  const brandList      = data ? [...data.brands, "Other"] : [];
  const models         = data && brand && brand !== "Other" ? (data.models[brand] ?? []) : [];
  const isAccessories  = category === "Accessories";

  const step1Ready = !!category && !!brand && (brand === "Other" ? !!otherBrandText.trim() : !!model);
  const step2Ready = !!serviceType && (
    serviceType === "mail-in"
      ? !!(zipCode.trim() || locationDisplay)
      : !!streetAddress.trim()
  );
  const step3Ready = selectedIssues.length > 0 && (!selectedIssues.includes("Other") || !!otherIssueText.trim());

  const toggleIssue = (issue: string) =>
    setSelectedIssues((p) => p.includes(issue) ? p.filter((i) => i !== issue) : [...p, issue]);

  // ── Progress bar ─────────────────────────────────────────────────────────
  // For Mail In: steps 1,2,3,5 map to visual positions 1,2,3,4
  // For Visit Store: steps 1,2,3,4,5 map to visual positions 1,2,3,4,5
  const isMailIn       = serviceType === "mail-in";
  const activeSteps    = isMailIn ? STEPS_MAILIN : STEPS_VISIT;
  // Map real step → visual index (Mail In skips step 4)
  const visualStep     = isMailIn && step === 5 ? 4 : step;

  const progressBar = (
    <div className="flex items-center gap-0 mb-10">
      {activeSteps.map((s, i) => (
        <div key={s} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              visualStep > i + 1
                ? "bg-violet-600 border-violet-600 text-white"
                : visualStep === i + 1
                ? "bg-white border-violet-600 text-violet-600"
                : "bg-white border-gray-200 text-gray-300"
            }`}>
              {visualStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-xs mt-1.5 font-medium ${visualStep >= i + 1 ? "text-gray-700" : "text-gray-300"}`}>{s}</span>
          </div>
          {i < activeSteps.length - 1 && (
            <div className={`h-px w-14 sm:w-24 mx-1 mb-5 transition-colors ${visualStep > i + 1 ? "bg-violet-500" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );

  // ── Bottom nav ────────────────────────────────────────────────────────────
  const BottomNav = ({
    onBack, onContinue, disabled, backLabel = "Back", continueLabel = "Continue →",
  }: { onBack?: () => void; onContinue: () => void; disabled?: boolean; backLabel?: string; continueLabel?: string }) => (
    <div className="flex items-center justify-between pt-5 mt-6 border-t border-gray-100">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> {backLabel}
        </button>
      ) : (
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium">
          <ChevronLeft className="w-4 h-4" /> {backLabel}
        </Link>
      )}
      <button
        onClick={onContinue}
        disabled={disabled}
        className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${
          !disabled
            ? "bg-violet-600 text-white hover:bg-violet-700 shadow-sm hover:shadow-md hover:-translate-y-px"
            : "bg-gray-100 text-gray-300 cursor-not-allowed"
        }`}
      >
        {continueLabel}
      </button>
    </div>
  );

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebar = (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
        {/* Device preview */}
        {category ? (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 relative flex-shrink-0">
              <Image src={DEVICES.find(d => d.cat === category)?.image ?? ""} alt={category} fill className="object-contain" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">YOUR DEVICE</p>
              <p className="text-sm font-semibold text-gray-800">
                {brand ? `${brand === "Other" ? otherBrandText || "Other" : brand}${(brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model) ? ` ${brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model}` : ""}` : category}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-gray-300">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">YOUR DEVICE</p>
              <p className="text-sm text-gray-300">Select a device</p>
            </div>
          </div>
        )}

        {/* Order details */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">ORDER DETAILS</p>
        <div className="space-y-2 mb-4">
          {[
            { label: "Device",   value: category ? `${category}${brand ? " — " + (brand === "Other" ? otherBrandText || "Other" : brand) : ""}` : null },
            { label: "Issues",   value: selectedIssues.length > 0 ? selectedIssues.join(", ") : null },
            { label: "Service",  value: serviceType === "mail-in" ? "Mail In" : serviceType === "visit-store" ? "Visit Store" : null },
            { label: "Schedule", value: date ? `${date}${time ? ", " + time : ""}` : null },
            { label: "Contact",  value: name || null },
          ].map(row => (
            <div key={row.label} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${row.value ? "border-violet-500 bg-violet-500" : "border-gray-200"}`}>
                {row.value && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className="text-xs text-gray-400 w-16 flex-shrink-0">{row.label}</span>
              <span className="text-xs text-gray-600 truncate">{row.value ?? "—"}</span>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="pt-4 border-t border-gray-100 space-y-2 mb-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">WHY MMZ</p>
          {[
            { icon: <ShieldCheck className="w-3.5 h-3.5"/>, text: "90-day repair warranty" },
            { icon: <Zap className="w-3.5 h-3.5"/>, text: "Same-day repairs" },
            { icon: <BadgeDollarSign className="w-3.5 h-3.5"/>, text: "Free diagnostics" },
          ].map(b => (
            <div key={b.text} className="flex items-center gap-2 text-xs text-gray-500">
              <span className="text-violet-500">{b.icon}</span>{b.text}
            </div>
          ))}
        </div>

        <a href="https://wa.me/923001234567" target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-green-500 hover:bg-green-600 text-white text-xs font-bold transition-colors">
          <MessageCircle className="w-3.5 h-3.5" /> Book via WhatsApp
        </a>

        <p className="text-center text-[10px] text-gray-400 mt-3">No payment now · Pay after service</p>
      </div>
    </aside>
  );

  // ── Confirmation screen ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Thank you <strong className="text-gray-800">{name}</strong>! We&apos;ve received your repair request
            for <strong className="text-gray-800">{model || brand || category}</strong>.
            Our team will call <strong className="text-gray-800">{phone}</strong> to confirm.
          </p>
          <div className="bg-gray-50 rounded-2xl p-5 text-left mb-8 space-y-2.5 text-sm border border-gray-100">
            {[
              { label: "Device",   value: `${category} › ${brand === "Other" ? otherBrandText || "Other" : brand}${(brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model) ? " › " + (brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model) : ""}` },
              { label: "Service",  value: serviceType === "mail-in" ? `Mail In — ${locationDisplay || zipCode}` : `Visit Store — ${streetAddress}` },
              selectedIssues.length > 0 && { label: "Issues",   value: selectedIssues.join(", ") + (otherIssueText ? ` — ${otherIssueText}` : "") },
              date && { label: "Date",     value: date },
              time && { label: "Time",     value: time },
            ].filter(Boolean).map((r) => {
              if (!r || typeof r === "boolean") return null;
              return (
                <div key={r.label} className="flex gap-3">
                  <span className="text-gray-400 w-14 flex-shrink-0">{r.label}:</span>
                  <span className="font-medium text-gray-800">{r.value}</span>
                </div>
              );
            })}
          </div>
          <Link href="/" className="inline-flex items-center px-8 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-full font-bold text-sm transition-all shadow-sm hover:shadow-md hover:-translate-y-px">
            Back to Home
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page title */}
        <div className="mb-8">
          <p className="text-xs font-bold text-violet-600 uppercase tracking-widest mb-2">Book a Repair</p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Schedule Your Repair</h1>
          <p className="text-gray-500 text-sm mt-1">Same-day service · 2 branches in Karachi</p>
        </div>

        {progressBar}

        <div className="flex gap-10 items-start">
          {/* ── Main step content ── */}
          <div className="flex-1 min-w-0">

            {/* ══════════════════════════════════════
                STEP 1 — Device + Brand + Model
            ══════════════════════════════════════ */}
            {step === 1 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">What device needs repair?</h2>
                <p className="text-sm text-gray-500 mb-7">Select your device type to get started.</p>

                {/* Device cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                  {DEVICES.map(({ cat, label, image }) => {
                    const active = category === cat;
                    return (
                      <button key={cat}
                        onClick={() => { setCategory(cat); setBrand(""); setModel(""); setOtherBrandText(""); setOtherModelText(""); }}
                        className={`group flex flex-col items-center gap-3 py-6 px-3 rounded-2xl border-2 bg-white transition-all duration-200 focus:outline-none ${
                          active
                            ? "border-violet-600 shadow-sm"
                            : "border-gray-200 hover:border-gray-400 hover:shadow-sm"
                        }`}>
                        <div className={`relative w-16 h-14 transition-transform duration-200 ${active ? "scale-110" : "group-hover:scale-105"}`}>
                          <Image src={image} alt={label} fill className="object-contain" sizes="80px" />
                        </div>
                        <span className={`text-xs font-bold tracking-wide transition-colors ${active ? "text-violet-600" : "text-gray-400"}`}>
                          {label.toUpperCase()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Brand pills */}
                {category && (
                  <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                      {isAccessories ? "Select type" : "Select brand"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {brandList.map((b) => {
                        const active  = brand === b;
                        const hasImg  = !isAccessories && BRAND_IMAGES[b];
                        return (
                          <button key={b}
                            onClick={() => { setBrand(b); setModel(""); setOtherBrandText(""); setOtherModelText(""); }}
                            className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-sm font-semibold border-2 transition-all duration-150 ${
                              active
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:shadow-sm"
                            }`}>
                            {hasImg && (
                              <img src={BRAND_IMAGES[b]} alt={b} className={`w-5 h-5 object-contain flex-shrink-0 ${active ? "brightness-0 invert" : ""}`} />
                            )}
                            {b === "Other" && <HelpCircle className="w-4 h-4" />}
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Model dropdown */}
                {brand && brand !== "Other" && models.length > 0 && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select model</p>
                      <div className="relative">
                        <select
                          value={model}
                          onChange={(e) => { setModel(e.target.value); setOtherModelText(""); }}
                          className={`w-full appearance-none rounded-xl border-2 px-4 py-3.5 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-300 bg-white transition-all ${
                            model ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                          }`}
                        >
                          <option value="">Choose your model</option>
                          {models.map((m) => <option key={m} value={m}>{m}</option>)}
                          <option value="Other / Not Listed">Other / Not Listed</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {model === "Other / Not Listed" && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Enter your model name</p>
                        <input
                          type="text"
                          value={otherModelText}
                          onChange={(e) => setOtherModelText(e.target.value)}
                          placeholder="e.g. Galaxy A32, Note 9, P30 Lite..."
                          autoFocus
                          className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white ${
                            otherModelText ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Other brand — text inputs */}
                {brand === "Other" && (
                  <div className="mb-6 space-y-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Enter your brand / device name</p>
                      <input
                        type="text"
                        value={otherBrandText}
                        onChange={(e) => setOtherBrandText(e.target.value)}
                        placeholder="e.g. Nokia, Huawei, Itel..."
                        autoFocus
                        className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white ${
                          otherBrandText ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                        }`}
                      />
                    </div>
                    {otherBrandText.trim() && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Enter your model (optional)</p>
                        <input
                          type="text"
                          value={otherModelText}
                          onChange={(e) => setOtherModelText(e.target.value)}
                          placeholder="e.g. Note 8 Pro, P30 Lite, Y91..."
                          className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white ${
                            otherModelText ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                )}

                <BottomNav
                  backLabel="Home"
                  onContinue={() => setStep(2)}
                  disabled={!step1Ready && !(brand === "Other")}
                />
              </div>
            )}

            {/* ══════════════════════════════════════
                STEP 2 — Issues
            ══════════════════════════════════════ */}
            {step === 2 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">What&apos;s the issue?</h2>
                <p className="text-sm text-gray-500 mb-7">Select all that apply — you can pick multiple.</p>

                <div className="flex flex-wrap gap-2.5 mb-6">
                  {ISSUES.map((issue) => {
                    const sel = selectedIssues.includes(issue);
                    return (
                      <button key={issue} onClick={() => toggleIssue(issue)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all ${
                          sel
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                        }`}>
                        {sel && <Check className="w-3.5 h-3.5" />}
                        {issue}
                      </button>
                    );
                  })}

                  {(() => {
                    const sel = selectedIssues.includes("Other");
                    return (
                      <button onClick={() => toggleIssue("Other")}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border-2 transition-all ${
                          sel
                            ? "border-violet-600 bg-violet-600 text-white"
                            : "border-dashed border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                        }`}>
                        {sel ? <Check className="w-3.5 h-3.5" /> : <HelpCircle className="w-3.5 h-3.5" />}
                        Other Issue
                      </button>
                    );
                  })()}
                </div>

                {selectedIssues.includes("Other") && (
                  <div className="mb-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Describe the issue <span className="text-violet-500">*</span>
                    </label>
                    <textarea
                      value={otherIssueText}
                      onChange={(e) => setOtherIssueText(e.target.value)}
                      rows={3}
                      placeholder="e.g. Screen flickering when charging, touch not working on bottom half..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-violet-400 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 transition resize-none"
                    />
                  </div>
                )}

                <BottomNav onBack={() => setStep(1)} onContinue={() => setStep(3)} disabled={!step3Ready} />
              </div>
            )}

            {/* ══════════════════════════════════════
                STEP 3 — Service Type
            ══════════════════════════════════════ */}
            {step === 3 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">How would you like to send your device?</h2>
                <p className="text-sm text-gray-500 mb-7">Choose your preferred service method.</p>

                {/* Tab buttons */}
                <div className="flex gap-3 mb-7">
                  {[
                    { key: "mail-in",     icon: <Package className="w-5 h-5" />,  label: "Mail In",     desc: "Send your device to us" },
                    { key: "visit-store", icon: <Store className="w-5 h-5" />,    label: "Visit Store", desc: "Bring it to our branch" },
                  ].map(({ key, icon, label, desc }) => {
                    const active = serviceType === key;
                    return (
                      <button key={key}
                        onClick={() => { setServiceType(key as "mail-in" | "visit-store"); setZipCode(""); setLocationDisplay(""); setStreetAddress(""); setLocationError(""); setDate(""); setTime(""); }}
                        className={`flex-1 flex items-center gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                          active
                            ? "border-violet-600 bg-violet-50"
                            : "border-gray-200 bg-white hover:border-gray-400"
                        }`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                          {icon}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${active ? "text-violet-700" : "text-gray-800"}`}>{label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                        </div>
                        {active && <Check className="w-4 h-4 text-violet-600 ml-auto flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Mail In fields */}
                {serviceType === "mail-in" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                        Your Area / Zip Code
                      </label>
                      <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => { setZipCode(e.target.value); setLocationDisplay(""); }}
                        placeholder="e.g. Gulshan-e-Iqbal, 75300..."
                        className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white ${
                          zipCode ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                        }`}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-100" />
                      <span className="text-xs text-gray-400 font-medium">or</span>
                      <div className="flex-1 h-px bg-gray-100" />
                    </div>

                    {/* Get current location */}
                    <button
                      onClick={getLocation}
                      disabled={locationLoading}
                      className={`w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        locationDisplay
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700"
                      }`}
                    >
                      {locationLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin text-violet-500" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                          </svg>
                          Getting location...
                        </>
                      ) : locationDisplay ? (
                        <>
                          <MapPin className="w-4 h-4 text-green-600" />
                          Location obtained ✓
                        </>
                      ) : (
                        <>
                          <Navigation className="w-4 h-4" />
                          Get Current Location
                        </>
                      )}
                    </button>

                    {locationDisplay && (
                      <p className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> {locationDisplay}
                      </p>
                    )}
                    {locationError && (
                      <p className="text-xs text-red-500">{locationError}</p>
                    )}
                  </div>
                )}

                {/* Visit Store fields */}
                {serviceType === "visit-store" && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                      Your Street Address
                    </label>
                    <input
                      type="text"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. House 12, Street 5, Block A, North Karachi..."
                      className={`w-full px-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition bg-white ${
                        streetAddress ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                      }`}
                    />
                    <p className="text-xs text-gray-400 mt-2">
                      We&apos;ll use this to estimate travel time and send reminders.
                    </p>
                  </div>
                )}

                <BottomNav onBack={() => setStep(2)} onContinue={() => serviceType === "visit-store" ? setStep(4) : setStep(5)} disabled={!step2Ready} />
              </div>
            )}


            {/* ══════════════════════════════════════
                STEP 4 — Schedule
            ══════════════════════════════════════ */}
            {step === 4 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Pick a date &amp; time</h2>

                <p className="text-sm text-gray-500 mb-7">Available at both our Karachi branches.</p>

                {/* Dates */}
                <div className="mb-7">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Select a date</p>
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {availableDates.map((d) => {
                      const label = d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                      const sel   = date === label;
                      return (
                        <button key={label} onClick={() => { setDate(label); setTime(""); }}
                          className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                            sel
                              ? "border-violet-600 bg-violet-50"
                              : "border-gray-200 bg-white hover:border-gray-400"
                          }`}>
                          <span className="text-[10px] font-bold text-gray-400 uppercase">
                            {d.toLocaleDateString("en-US", { weekday: "short" })}
                          </span>
                          <span className={`text-lg font-bold mt-0.5 ${sel ? "text-violet-600" : "text-gray-800"}`}>{d.getDate()}</span>
                          <span className="text-[10px] text-gray-400">{d.toLocaleDateString("en-US", { month: "short" })}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Times */}
                {date && (
                  <div className="mb-2">
                    <div className="flex items-center gap-3 mb-3">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select a time</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        isSunday(date)
                          ? "bg-blue-50 text-blue-500"
                          : "bg-violet-50 text-violet-500"
                      }`}>
                        {isSunday(date) ? "Open 10 AM – 12 AM" : "Open 1 PM – 11 PM"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(isSunday(date) ? SUNDAY_SLOTS : MON_SAT_SLOTS).map((slot) => {
                        const sel = time === slot;
                        return (
                          <button key={slot} onClick={() => setTime(slot)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all ${
                              sel
                                ? "border-violet-600 bg-violet-600 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-400"
                            }`}>
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <BottomNav onBack={() => setStep(3)} onContinue={() => setStep(5)} disabled={!date || !time} />
              </div>
            )}

            {/* ══════════════════════════════════════
                STEP 5 — Customer details
            ══════════════════════════════════════ */}
            {step === 5 && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Your details</h2>
                <p className="text-sm text-gray-500 mb-7">We&apos;ll call to confirm your appointment.</p>

                <div className="space-y-5 max-w-md mb-6">
                  {[
                    { label: "Full Name", icon: <User className="w-4 h-4 text-gray-400"/>, value: name, setter: setName, type: "text", placeholder: "e.g. Ali Khan", required: true },
                    { label: "Phone Number", icon: <Phone className="w-4 h-4 text-gray-400"/>, value: phone, setter: setPhone, type: "tel", placeholder: "e.g. 03001234567", required: true },
                    { label: "Email (optional)", icon: <Mail className="w-4 h-4 text-gray-400"/>, value: email, setter: setEmail, type: "email", placeholder: "you@example.com", required: false },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">{f.label}</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{f.icon}</span>
                        <input type={f.type} value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
                          className={`w-full pl-10 pr-4 py-3.5 rounded-xl border-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition ${
                            f.value ? "border-violet-600 text-gray-900" : "border-gray-200 text-gray-400"
                          }`} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recap card */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-2 mb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Booking Recap</p>
                  {[
                    { label: "Device",   value: `${category} › ${brand === "Other" ? otherBrandText || "Other" : brand}${(brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model) ? " › " + (brand === "Other" ? otherModelText : model === "Other / Not Listed" ? otherModelText : model) : ""}` },
                    { label: "Service",  value: serviceType === "mail-in" ? `Mail In — ${locationDisplay || zipCode}` : `Visit Store — ${streetAddress}` },
                    selectedIssues.length > 0 && { label: "Issues",   value: selectedIssues.join(", ") + (otherIssueText ? ` — ${otherIssueText}` : "") },
                    date && { label: "Date",     value: `${date}${time ? " at " + time : ""}` },
                  ].filter(Boolean).map((r) => {
                    if (!r || typeof r === "boolean") return null;
                    return (
                      <div key={r.label} className="flex gap-3 text-sm">
                        <span className="text-gray-400 w-14 flex-shrink-0">{r.label}:</span>
                        <span className="text-gray-700 font-medium">{r.value}</span>
                      </div>
                    );
                  })}
                </div>

                <BottomNav
                  onBack={() => serviceType === "visit-store" ? setStep(4) : setStep(3)}
                  onContinue={() => setSubmitted(true)}
                  disabled={!name || !phone}
                  continueLabel="Confirm Booking"
                />
              </div>
            )}

          </div>

          {sidebar}
        </div>
      </main>
      <Footer />
    </div>
  );
}
