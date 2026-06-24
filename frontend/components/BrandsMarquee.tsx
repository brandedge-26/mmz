import Image from "next/image";

const BRANDS = [
  { name: "Apple",        src: "/appoinments/brands/apple.svg" },
  { name: "Samsung",      src: "/appoinments/brands/samsung.svg" },
  { name: "Google Pixel", src: "/appoinments/brands/gooogle-pixel.svg" },
  { name: "Motorola",     src: "/appoinments/brands/motorola-real.svg" },
  { name: "OnePlus",      src: "/appoinments/brands/oneplus.svg" },
  { name: "Vivo",         src: "/appoinments/brands/vivo.svg" },
  { name: "Oppo",         src: "/appoinments/brands/oppo.svg" },
  { name: "Xiaomi",       src: "/appoinments/brands/xiaomi.svg" },
  { name: "Infinix",      src: "/appoinments/brands/infinix.svg" },
  { name: "Realme",       src: "/appoinments/brands/realme.svg" },
  { name: "Tecno",        src: "/appoinments/brands/tecno.svg" },
  { name: "Lenovo",       src: "/appoinments/brands/lenovo.svg" },
  { name: "Huawei",       src: "/appoinments/brands/huawei.png" },
];

function LogoList() {
  return (
    <>
      {BRANDS.map((brand) => (
        <div key={brand.name} className="flex-shrink-0 flex items-center justify-center px-8">
          <Image
            src={brand.src}
            alt={brand.name}
            width={48}
            height={40}
            className="object-contain grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
          />
        </div>
      ))}
    </>
  );
}

export default function BrandsMarquee() {
  return (
    <section className="py-7 border-y border-gray-100 bg-white overflow-hidden">
      <div
        className="flex"
        style={{ animation: "marquee 25s linear infinite" }}
      >
        <LogoList />
        <LogoList />
      </div>
    </section>
  );
}
