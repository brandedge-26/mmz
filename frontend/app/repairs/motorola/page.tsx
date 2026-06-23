import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked LCD or P-OLED display replaced with OEM-grade panel.", price: "From Rs. 2,800", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore original battery life with a high-capacity genuine cell.", price: "From Rs. 1,800", time: "30 min" },
  { name: "Charging Port Repair", desc: "USB-C charging port repaired for fast charge and data sync.", price: "From Rs. 1,400", time: "1 hr" },
  { name: "Back Panel Repair", desc: "Cracked rear cover replaced — original finish restored.", price: "From Rs. 2,000", time: "1–2 hrs" },
  { name: "Camera Repair", desc: "Front or rear camera — blurry, black, or broken — fixed.", price: "From Rs. 1,800", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full diagnostic & board-level treatment for liquid damage.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "Moto Edge 50 Ultra", "Moto Edge 50 Pro", "Moto Edge 50", "Moto Edge 40 Pro",
  "Moto Edge 40", "Moto Edge 30 Ultra", "Moto Edge 30 Pro", "Moto Edge 30",
  "Moto G84", "Moto G73", "Moto G54", "Moto G34",
  "Moto G Power (2024)", "Moto G Stylus (2024)", "Moto G Play (2024)", "Moto G Fast",
];

export default function MotorolaRepairPage() {
  return (
    <RepairPageTemplate
      brand="Motorola"
      brandIcon="/header-images/phone-repair/motorola.png"
      heroImage="/home/phone-repair/motrols.png"
      badgeIcon={null}
      badgeText="Motorola Repair Specialist"
      badgeSubtext="Quality parts, expert hands"
      headline="Expert Motorola repairs — done same day."
      subtext="Screen cracks, battery issues, or software faults — we repair all Moto models with quality parts and a warranty you can trust."
      repairs={repairs}
      repairsHeading="Common Motorola repairs"
      models={models}
      modelsHeading="All Motorola models covered"
      ctaBadge="Same Day Motorola Repair Available"
      ctaHeading="Ready to fix your Motorola?"
    />
  );
}
