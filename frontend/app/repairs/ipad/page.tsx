import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked or shattered iPad display replaced with OEM-grade glass.", price: "From Rs. 6,500", time: "2–3 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life with a genuine capacity cell.", price: "From Rs. 3,500", time: "1–2 hrs" },
  { name: "Charging Port Repair", desc: "Fix slow charging, loose connector, or no charge issues.", price: "From Rs. 2,500", time: "1 hr" },
  { name: "Back Glass / Housing", desc: "Dented or cracked back housing replaced — looks brand new.", price: "From Rs. 4,000", time: "2–3 hrs" },
  { name: "Camera Repair", desc: "Blurry, black, or broken front/rear iPad camera fixed.", price: "From Rs. 2,800", time: "1–2 hrs" },
  { name: "Software / Boot Issues", desc: "iPad stuck on Apple logo, bootloop or software failure resolved.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "iPad Pro 12.9\" (6th Gen)", "iPad Pro 11\" (4th Gen)", "iPad Pro 12.9\" (5th Gen)",
  "iPad Pro 11\" (3rd Gen)", "iPad Air (5th Gen)", "iPad Air (4th Gen)",
  "iPad (10th Gen)", "iPad (9th Gen)", "iPad (8th Gen)",
  "iPad mini (6th Gen)", "iPad mini (5th Gen)", "iPad mini 4",
];

export default function IPadRepairPage() {
  return (
    <RepairPageTemplate
      brand="iPad"
      brandIcon="/header-images/tech-repair/ipad.png"
      heroImage="/home/ipad.jpg"
      badgeIcon={null}
      badgeText="Apple Tablet Repair Specialist"
      badgeSubtext="Genuine-grade Apple iPad parts used"
      headline="Expert iPad repairs — screen to battery."
      subtext="Cracked screen, dead battery, or charging issues — we repair all iPad models with genuine-grade parts and back every fix with a full warranty."
      repairs={repairs}
      repairsHeading="Common iPad repairs"
      models={models}
      modelsHeading="All iPad models covered"
      ctaBadge="Same Day iPad Repair Available"
      ctaHeading="Ready to fix your iPad?"
    />
  );
}
