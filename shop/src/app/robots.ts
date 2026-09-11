import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/account", "/cart", "/checkout", "/orders", "/wishlist"] },
    ],
    sitemap: "https://shop.memonmobilezone122.pk/sitemap.xml",
  };
}
