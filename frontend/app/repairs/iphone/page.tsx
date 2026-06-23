import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked or unresponsive display replaced with OEM-grade glass.", price: "From Rs. 4,500", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life with a genuine capacity cell.", price: "From Rs. 2,500", time: "30 min" },
  { name: "Charging Port Repair", desc: "Fix slow charging, loose cable, or no charge issues.", price: "From Rs. 1,800", time: "1 hr" },
  { name: "Back Glass Repair", desc: "Shattered back glass replaced — looks brand new.", price: "From Rs. 3,000", time: "2 hrs" },
  { name: "Camera Repair", desc: "Blurry, black, or broken front/rear camera fixed.", price: "From Rs. 2,200", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Full diagnostic & micro-soldering treatment for liquid damage.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16",
  "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max",
  "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13",
  "iPhone 12 Pro Max", "iPhone 12", "iPhone 11 Pro Max", "iPhone 11",
  "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X",
];

export default function IPhoneRepairPage() {
  return (
    <RepairPageTemplate
      brand="iPhone"
      brandIcon="/header-images/phone-repair/iphone.png"
      heroImage="/home/phone-repair/iphone.png"
      badgeIcon="/repairs/apple-badge.png"
      badgeText="Authorised Repair Provider"
      badgeSubtext="Genuine-grade Apple parts used"
      headline="Expert iPhone repairs — done right."
      subtext="Cracked screen, dead battery, or water damage — we fix all iPhone models with genuine-grade parts and back every repair with a warranty."
      repairs={repairs}
      repairsHeading="Common iPhone repairs"
      models={models}
      modelsHeading="All iPhone models covered"
      ctaBadge="Same Day iPhone Repair Available"
      ctaHeading="Ready to fix your iPhone?"
    />
  );
}
