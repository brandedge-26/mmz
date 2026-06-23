import Image from "next/image";

const reviews = [
  {
    name: "Muhammad Ahmed",
    device: "iPhone 14 Pro — Screen Replacement",
    rating: 5,
    text: "Screen cracked badly after a fall. Fixed it within 2 hours, display looks completely brand new. Super professional and gave a warranty too.",
    initials: "MA",
    color: "from-violet-600 to-violet-800",
    image: "/home/same-day-repair.jpg",
    time: "2 days ago",
  },
  {
    name: "Sana Khan",
    device: "Samsung Galaxy S23 — Battery",
    rating: 5,
    text: "Battery was draining in under 3 hours. They replaced it the same day at a very fair price. Phone now lasts all day. Great service!",
    initials: "SK",
    color: "from-pink-500 to-rose-700",
    image: "/home/home-phone-repair.jpg",
    time: "1 week ago",
  },
  {
    name: "Usman Tariq",
    device: "OnePlus 11 — Water Damage",
    rating: 5,
    text: "Water damaged phone — everyone said it's gone. Memon Mobile Zone repaired it in one day and it's working perfectly. Absolutely brilliant!",
    initials: "UT",
    color: "from-amber-500 to-orange-700",
    image: "/home/technician-1.png",
    time: "3 weeks ago",
  },
  {
    name: "Bilal Sheikh",
    device: "iPhone 13 — Back Glass",
    rating: 5,
    text: "Back glass was shattered. They replaced it and it looks like a brand new phone. The warranty gave me real peace of mind. 10/10 experience.",
    initials: "BS",
    color: "from-green-500 to-emerald-700",
    image: "/home/technician-2.png",
    time: "1 month ago",
  },
];


function Stars({ size = "sm" }: { size?: "sm" | "md" }) {
  const cls = size === "md" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`${cls} text-amber-400`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function ReviewsSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-violet-600 text-xs font-bold uppercase tracking-widest mb-2">Customer Reviews</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Real repairs. Real customers.<br />
              <span className="text-violet-600">Real results.</span>
            </h2>
            <p className="text-gray-400 mt-2 text-sm max-w-md">
              Hundreds of happy customers across Karachi — here&apos;s what they say.
            </p>
          </div>

          {/* Rating badge */}
          <div className="flex items-center gap-5 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 shrink-0">
            <div className="text-center">
              <p className="text-5xl font-extrabold text-gray-900 leading-none">4.9</p>
              <div className="flex justify-center mt-1.5">
                <Stars size="md" />
              </div>
              <p className="text-xs text-gray-400 mt-1">500+ reviews</p>
            </div>
            <div className="w-px h-14 bg-gray-200" />
            <div className="space-y-1.5">
              {[["5★", "92%"], ["4★", "6%"], ["3★", "2%"]].map(([star, pct]) => (
                <div key={star} className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 w-5">{star}</span>
                  <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Image cards — new-jesup style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {reviews.map((r) => (
            <div key={r.name} className="group relative rounded-2xl overflow-hidden h-[400px]">
              {/* Background image */}
              <Image
                src={r.image}
                alt={r.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/70" />

              {/* Glassmorphism review box */}
              <div className="absolute bottom-3 left-3 right-3 rounded-xl p-4 backdrop-blur-md bg-white/15 border border-white/25 shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <Stars />
                  <div className="flex items-center gap-1 text-white/70 text-[10px]">
                    <GoogleIcon />
                    <span>Google</span>
                  </div>
                </div>
                <p className="text-sm text-white leading-relaxed line-clamp-3 drop-shadow">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-white/20 flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white drop-shadow leading-tight">{r.name}</p>
                    <p className="text-[11px] text-white/60 mt-0.5">{r.device}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
