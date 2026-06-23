import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Screen Replacement", desc: "Cracked OLED display replaced with OEM-grade panel — touch & Face Unlock preserved.", price: "From Rs. 4,000", time: "1–2 hrs" },
  { name: "Battery Replacement", desc: "Restore all-day battery life on any Pixel model.", price: "From Rs. 2,200", time: "30 min" },
  { name: "Charging Port Repair", desc: "USB-C port repair for fast charging and data transfer.", price: "From Rs. 1,600", time: "1 hr" },
  { name: "Back Glass Repair", desc: "Cracked rear glass replaced — original finish restored.", price: "From Rs. 2,800", time: "2 hrs" },
  { name: "Camera Repair", desc: "Pixel's legendary camera — front or rear — fixed fast.", price: "From Rs. 2,500", time: "1–2 hrs" },
  { name: "Water Damage", desc: "Board-level cleaning and repair for liquid-damaged Pixel phones.", price: "From Rs. 2,000", time: "Same day" },
];

const models = [
  "Pixel 9 Pro XL", "Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro",
  "Pixel 8", "Pixel 7 Pro", "Pixel 7", "Pixel 7a",
  "Pixel 6 Pro", "Pixel 6", "Pixel 6a", "Pixel 5",
  "Pixel 4a 5G", "Pixel 4a", "Pixel 4 XL", "Pixel 4",
];

export default function GooglePixelRepairPage() {
  return (
    <RepairPageTemplate
      brand="Google Pixel"
      brandIcon="/header-images/phone-repair/google.png"
      heroImage="/home/phone-repair/google-pixel.png"
      badgeIcon="/repairs/google-badge.png"
      badgeText="Google Service Provider"
      badgeSubtext="Genuine-grade Pixel parts used"
      headline="Expert Google Pixel repairs — sorted fast."
      subtext="Display cracks, battery issues, or camera faults — we repair all Pixel models with genuine-grade parts and a full warranty."
      repairs={repairs}
      repairsHeading="Common Pixel repairs"
      models={models}
      modelsHeading="All Google Pixel models covered"
      ctaBadge="Same Day Pixel Repair Available"
      ctaHeading="Ready to fix your Pixel?"
    />
  );
}
