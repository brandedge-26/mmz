import RepairPageTemplate from "@/components/RepairPageTemplate";

const repairs = [
  { name: "Smartwatch Screen", desc: "Cracked or unresponsive smartwatch display replaced with precision.", price: "From Rs. 3,500", time: "2–3 hrs" },
  { name: "Smartwatch Battery", desc: "Restore full-day wearable battery life with a genuine cell.", price: "From Rs. 2,500", time: "1–2 hrs" },
  { name: "Earbuds Repair", desc: "One side not working, charging case issues, or audio faults fixed.", price: "From Rs. 1,500", time: "1 hr" },
  { name: "Earbuds Charging Case", desc: "Charging case not working or not holding charge — repaired.", price: "From Rs. 1,200", time: "1 hr" },
  { name: "Wearable Charging Port", desc: "Smartwatch or earbuds not charging — port or pin repair.", price: "From Rs. 1,800", time: "Same day" },
  { name: "Other Devices", desc: "Not sure? Bring it in — we'll diagnose any device free of charge.", price: "Free Diagnosis", time: "Same day" },
];

const models = [
  "Apple Watch Series 9", "Apple Watch SE", "Apple Watch Ultra",
  "Samsung Galaxy Watch 6", "Samsung Galaxy Watch 5", "Huawei Watch GT 4",
  "AirPods Pro", "AirPods (3rd Gen)", "Samsung Galaxy Buds 2",
  "Xiaomi Buds", "Oppo Enco", "OnePlus Buds",
  "JBL Earbuds", "Sony WH Headphones", "Any other device",
];

export default function SomethingElseRepairPage() {
  return (
    <RepairPageTemplate
      brand="Something Else"
      brandIcon="/header-images/tech-repair/ipad.png"
      heroImage="/home/wearables.jpg"
      badgeIcon={null}
      badgeText="We Repair Almost Anything"
      badgeSubtext="Smartwatches, earbuds & more"
      headline="Got something else? We fix that too."
      subtext="Smartwatch, earbuds, charging case or any other gadget — bring it in for a free diagnosis. If it has a power button, chances are we can fix it."
      repairs={repairs}
      repairsHeading="What else we repair"
      models={models}
      modelsHeading="Devices & brands we service"
      ctaBadge="Free Diagnosis on Any Device"
      ctaHeading="Not sure if we can fix it?"
    />
  );
}
