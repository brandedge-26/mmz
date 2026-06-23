import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked or unresponsive Oppo display replaced with OEM-grade glass.", price: "From Rs. 3,500", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life with a genuine high-capacity cell.", price: "From Rs. 2,000", time: "30 min" },
  { name: "Charging Port Repair", desc: "Fix slow charging, loose USB-C port, or no charge issues.", price: "From Rs. 1,500", time: "1 hr" },
  { name: "Back Glass Repair", desc: "Shattered back panel replaced — restores look and feel.", price: "From Rs. 2,500", time: "2 hrs" },
  { name: "Camera Repair", desc: "Blurry, black, or broken front/rear camera fixed same day.", price: "From Rs. 2,000", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full diagnostic & micro-soldering treatment for liquid damage.", price: "From Rs. 1,800", time: "Same day" },
];

const models = [
  "Oppo Find X7 Pro", "Oppo Find X6 Pro", "Oppo Find X5 Pro",
  "Oppo Reno 11 Pro", "Oppo Reno 11", "Oppo Reno 10 Pro",
  "Oppo Reno 10", "Oppo Reno 8 Pro", "Oppo Reno 8",
  "Oppo A98", "Oppo A78", "Oppo A58",
  "Oppo A38", "Oppo A18", "Oppo F25 Pro",
];

export default function OppoRepairPage() {
  return (
    <RepairPageTemplate
      brand="Oppo"
      brandIcon="/header-images/phone-repair/oppo.jpg"
      heroImage="/header-images/phone-repair/oppo.jpg"
      badgeIcon={null}
      badgeText="Oppo Repair Specialist"
      badgeSubtext="Quality parts, expert technicians"
      headline="Expert Oppo repairs — fast & reliable."
      subtext="Screen damage, battery drain, or water damage — we repair all Oppo models with quality parts and back every fix with a full warranty."
      repairs={repairs}
      repairsHeading="Common Oppo repairs"
      models={models}
      modelsHeading="All Oppo models covered"
      ctaBadge="Same Day Oppo Repair Available"
      ctaHeading="Ready to fix your Oppo?"
    />
  );
}
