import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked or unresponsive Vivo display replaced with OEM-grade glass.", price: "From Rs. 3,500", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life with a genuine high-capacity cell.", price: "From Rs. 2,000", time: "30 min" },
  { name: "Charging Port Repair", desc: "Fix slow charging, loose USB-C port, or no charge issues.", price: "From Rs. 1,500", time: "1 hr" },
  { name: "Back Glass Repair", desc: "Shattered back panel replaced — restores original look.", price: "From Rs. 2,500", time: "2 hrs" },
  { name: "Camera Repair", desc: "Blurry, black, or broken front/rear camera fixed same day.", price: "From Rs. 2,000", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full diagnostic & micro-soldering treatment for liquid damage.", price: "From Rs. 1,800", time: "Same day" },
];

const models = [
  "Vivo X100 Pro", "Vivo X90 Pro", "Vivo X80 Pro",
  "Vivo V29 Pro", "Vivo V29", "Vivo V27 Pro",
  "Vivo V27", "Vivo V25 Pro", "Vivo V25",
  "Vivo Y100", "Vivo Y78", "Vivo Y56",
  "Vivo Y36", "Vivo Y22", "Vivo T2 Pro",
];

export default function VivoRepairPage() {
  return (
    <RepairPageTemplate
      brand="Vivo"
      brandIcon="/header-images/phone-repair/vivo.jpg"
      heroImage="/header-images/phone-repair/vivo.jpg"
      badgeIcon={null}
      badgeText="Vivo Repair Specialist"
      badgeSubtext="Quality parts, expert technicians"
      headline="Expert Vivo repairs — same day service."
      subtext="Screen cracks, battery issues, or charging faults — we repair all Vivo models with quality parts and a warranty you can trust."
      repairs={repairs}
      repairsHeading="Common Vivo repairs"
      models={models}
      modelsHeading="All Vivo models covered"
      ctaBadge="Same Day Vivo Repair Available"
      ctaHeading="Ready to fix your Vivo?"
    />
  );
}
