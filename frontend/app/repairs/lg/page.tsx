import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked OLED or LCD display replaced with OEM-grade panel.", price: "From Rs. 2,500", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore original battery performance with a quality cell.", price: "From Rs. 1,800", time: "30 min" },
  { name: "Charging Port Repair", desc: "USB-C or Micro-USB port repaired for reliable charging.", price: "From Rs. 1,400", time: "1 hr" },
  { name: "Back Panel Repair", desc: "Cracked or shattered rear glass replaced — looks like new.", price: "From Rs. 2,000", time: "1–2 hrs" },
  { name: "Camera Repair", desc: "Front or rear camera repaired — blurry or broken, we fix it.", price: "From Rs. 1,800", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full diagnostic & board-level cleaning for water-damaged LG phones.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "LG Velvet 5G", "LG Wing 5G", "LG V60 ThinQ", "LG V50 ThinQ",
  "LG V40 ThinQ", "LG G8 ThinQ", "LG G7 ThinQ", "LG G6",
  "LG Stylo 6", "LG Stylo 5", "LG K92 5G", "LG K62",
  "LG K52", "LG K42", "LG Q92 5G", "LG Q70",
];

export default function LGRepairPage() {
  return (
    <RepairPageTemplate
      brand="LG"
      brandIcon="/header-images/phone-repair/LG.png"
      heroImage="/home/phone-repair/lg.png"
      badgeIcon={null}
      badgeText="LG Repair Specialist"
      badgeSubtext="Quality parts, expert service"
      headline="Expert LG repairs — fast & affordable."
      subtext="Screen damage, charging issues, or battery problems — we repair all LG models with quality parts and a full warranty."
      repairs={repairs}
      repairsHeading="Common LG repairs"
      models={models}
      modelsHeading="All LG models covered"
      ctaBadge="Same Day LG Repair Available"
      ctaHeading="Ready to fix your LG?"
    />
  );
}
