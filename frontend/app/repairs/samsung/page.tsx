import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked AMOLED/Super AMOLED display replaced with OEM-grade panel.", price: "From Rs. 3,500", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore original battery life with a high-capacity genuine cell.", price: "From Rs. 2,000", time: "30 min" },
  { name: "Charging Port Repair", desc: "Fix USB-C port for fast charging, data sync, and Dex support.", price: "From Rs. 1,500", time: "1 hr" },
  { name: "Back Panel Repair", desc: "Shattered glass back replaced — original look restored.", price: "From Rs. 2,500", time: "2 hrs" },
  { name: "Camera Repair", desc: "Blurry, dark, or broken front/rear camera — fixed fast.", price: "From Rs. 2,000", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full board cleaning and micro-soldering for liquid-damaged Galaxy phones.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra",
  "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23+",
  "Galaxy S23", "Galaxy S22 Ultra", "Galaxy S22", "Galaxy A55",
  "Galaxy A35", "Galaxy A15", "Galaxy Z Fold 6", "Galaxy Z Flip 6",
  "Galaxy Z Fold 5", "Galaxy Z Flip 5", "Galaxy Note 20 Ultra", "Galaxy Note 10+",
];

export default function SamsungRepairPage() {
  return (
    <RepairPageTemplate
      brand="Samsung"
      brandIcon="/header-images/phone-repair/samsung.png"
      heroImage="/home/phone-repair/samsung2.png"
      badgeIcon="/repairs/samsung-badge.png"
      badgeText="Samsung Authorised Service"
      badgeSubtext="Genuine Samsung parts used"
      headline="Expert Samsung repairs — fast & reliable."
      subtext="Screen damage, battery drain, or water damage — we repair all Galaxy models with genuine parts and a full warranty."
      repairs={repairs}
      repairsHeading="Common Samsung repairs"
      models={models}
      modelsHeading="All Samsung models covered"
      ctaBadge="Same Day Samsung Repair Available"
      ctaHeading="Ready to fix your Samsung?"
    />
  );
}
