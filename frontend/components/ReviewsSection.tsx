const reviews = [
  {
    name: "Muhammad Ahmed",
    device: "iPhone 14 Pro — Screen Replacement",
    rating: 5,
    text: "Screen cracked badly after a fall. Came here and they fixed it within 2 hours. Display looks completely brand new. Staff was super professional and gave a warranty too. Highly recommend!",
    initials: "MA",
    color: "bg-violet-600",
    time: "2 days ago",
    platform: "Google",
  },
  {
    name: "Sana Khan",
    device: "Samsung Galaxy S23 — Battery",
    rating: 5,
    text: "Battery was draining in under 3 hours. They replaced it the same day at a very fair price. Phone now lasts all day again. Great service and really friendly staff!",
    initials: "SK",
    color: "bg-pink-500",
    time: "1 week ago",
    platform: "Google",
  },
  {
    name: "Ahmed Raza",
    device: "Apple Watch Series 8 — Screen",
    rating: 5,
    text: "Watch screen was completely shattered. I didn't expect them to fix it but they did it perfectly. Explained everything clearly and the price was very reasonable.",
    initials: "AR",
    color: "bg-indigo-500",
    time: "2 weeks ago",
    platform: "Google",
  },
  {
    name: "Usman Tariq",
    device: "OnePlus 11 — Water Damage",
    rating: 5,
    text: "Water damaged phone — everyone else said it can't be fixed. Memom Mobile Zone repaired it in one day and it's working perfectly. Absolutely brilliant. Will always come back here!",
    initials: "UT",
    color: "bg-amber-500",
    time: "3 weeks ago",
    platform: "Google",
  },
  {
    name: "Fatima Noor",
    device: "Samsung Tab S8 — Charging Port",
    rating: 5,
    text: "Very professional team. Free diagnosis, clear quote, no hidden charges. Fixed my tablet's charging port in under an hour. Exactly the kind of service I was looking for.",
    initials: "FN",
    color: "bg-teal-500",
    time: "1 month ago",
    platform: "Google",
  },
  {
    name: "Bilal Sheikh",
    device: "iPhone 13 — Back Glass",
    rating: 5,
    text: "Back glass was shattered. They replaced it and it looks like a brand new phone. The lifetime warranty gave me real peace of mind. 10/10 experience.",
    initials: "BS",
    color: "bg-green-500",
    time: "1 month ago",
    platform: "Google",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3.5 h-3.5 ${i < count ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
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
    <section className="bg-gray-50 py-24 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-14">
          <div>
            <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-3">Customer Reviews</p>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              What our customers <br className="hidden sm:block" />
              are saying.
            </h2>
            <p className="text-gray-400 mt-3 text-base max-w-md">
              Real reviews from real people across Karachi. No fake ratings — just honest feedback.
            </p>
          </div>

          {/* Rating card */}
          <div className="flex sm:justify-end">
            <div className="bg-white border border-gray-100 rounded-3xl px-8 py-6 shadow-sm flex items-center gap-6">
              <div className="text-center">
                <p className="text-6xl font-extrabold text-gray-900 leading-none">4.9</p>
                <div className="flex justify-center mt-2 gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Based on 500+ reviews</p>
              </div>
              <div className="h-16 w-px bg-gray-100" />
              <div className="space-y-2">
                {[5, 4, 3].map((star, i) => (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 w-2">{star}</span>
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: i === 0 ? "92%" : i === 1 ? "6%" : "2%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg hover:shadow-gray-100 hover:border-gray-200 hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <Stars count={r.rating} />
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <GoogleIcon />
                  <span>Google</span>
                </div>
              </div>

              {/* Review text */}
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>

              {/* Author */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                    {r.initials}
                  </div>
                  <div>
                    <p className="text-gray-900 text-sm font-semibold leading-tight">{r.name}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{r.device}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-300">{r.time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
