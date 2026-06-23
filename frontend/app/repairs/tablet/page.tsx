import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked or unresponsive tablet display replaced with quality glass.", price: "From Rs. 4,500", time: "2–3 hrs" },
  { name: "Battery Replacement", desc: "Restore full-day battery life with a high-capacity genuine cell.", price: "From Rs. 2,800", time: "1–2 hrs" },
  { name: "Charging Port Repair", desc: "Fix loose USB-C/micro-USB port, slow or no charging.", price: "From Rs. 2,000", time: "1 hr" },
  { name: "Back Cover / Housing", desc: "Damaged back panel replaced — restores look and structure.", price: "From Rs. 3,000", time: "2 hrs" },
  { name: "Camera Repair", desc: "Front or rear camera blurry, dark or broken — fixed same day.", price: "From Rs. 2,200", time: "1–2 hrs" },
  { name: "Software / Boot Issues", desc: "Tablet stuck in bootloop, factory reset, or software recovery.", price: "From Rs. 1,800", time: "Same day" },
];

const models = [
  "Samsung Galaxy Tab S9", "Samsung Galaxy Tab S8", "Samsung Galaxy Tab S7",
  "Samsung Galaxy Tab A9+", "Samsung Galaxy Tab A8", "Samsung Galaxy Tab A7",
  "Huawei MatePad Pro", "Huawei MatePad 11", "Lenovo Tab P12",
  "Xiaomi Pad 6", "Realme Pad X", "Oppo Pad 2",
];

export default function TabletRepairPage() {
  return (
    <RepairPageTemplate
      brand="Tablet"
      brandIcon="/header-images/tech-repair/tablet.png"
      heroImage="/home/services/tablet-service.webp"
      badgeIcon={null}
      badgeText="Android Tablet Repair Specialist"
      badgeSubtext="Quality parts, expert technicians"
      headline="Expert tablet repairs — fast & affordable."
      subtext="Screen damage, battery drain, or charging faults — we repair all Android tablet brands with quality parts and a warranty on every fix."
      repairs={repairs}
      repairsHeading="Common tablet repairs"
      models={models}
      modelsHeading="All tablet brands covered"
      ctaBadge="Same Day Tablet Repair Available"
      ctaHeading="Ready to fix your tablet?"
    />
  );
}
