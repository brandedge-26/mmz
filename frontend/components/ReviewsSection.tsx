const reviews = [
  {
    name: "Rahul M.",
    device: "iPhone 14 Pro",
    rating: 5,
    text: "Screen cracked badly after a fall. Came to Memom Mobile Zone and they fixed it within 2 hours. Display looks brand new. Highly recommend!",
    initials: "RM",
    color: "bg-violet-600",
    time: "2 days ago",
  },
  {
    name: "Sana K.",
    device: "Samsung Galaxy S23",
    rating: 5,
    text: "Battery was draining super fast. They replaced it same day at a very fair price. Phone feels like I just bought it. Great service!",
    initials: "SK",
    color: "bg-pink-500",
    time: "1 week ago",
  },
  {
    name: "Ahmed R.",
    device: "Apple Watch Series 8",
    rating: 5,
    text: "Watch screen was shattered. I didn't expect them to fix it but they did — perfectly. Staff was polite and explained everything clearly.",
    initials: "AR",
    color: "bg-indigo-500",
    time: "2 weeks ago",
  },
  {
    name: "Priya S.",
    device: "iPad Air",
    rating: 4,
    text: "Charging port wasn't working at all. Fixed it in under an hour. Price was reasonable and they gave a warranty too. Will come back!",
    initials: "PS",
    color: "bg-green-500",
    time: "3 weeks ago",
  },
  {
    name: "Usman T.",
    device: "OnePlus 11",
    rating: 5,
    text: "Water damaged phone — everyone else said it can't be fixed. Memom Mobile Zone fixed it in one day. Absolutely brilliant. Thank you!",
    initials: "UT",
    color: "bg-amber-500",
    time: "1 month ago",
  },
  {
    name: "Fatima N.",
    device: "Samsung Tab S8",
    rating: 5,
    text: "Very professional team. Diagnosed the problem for free and gave me a clear quote. No hidden charges. Exactly what I expected.",
    initials: "FN",
    color: "bg-teal-500",
    time: "1 month ago",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? "text-amber-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  return (
    <section className="bg-gray-50 py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-violet-600 text-sm font-semibold uppercase tracking-widest mb-2">Customer Reviews</p>
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">What our customers say</h2>
            <p className="text-gray-400 mt-2 text-base">Real reviews from real people we&apos;ve helped.</p>
          </div>
          {/* Overall rating */}
          <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl px-5 py-3 shadow-sm">
            <div className="text-4xl font-extrabold text-gray-900">4.9</div>
            <div>
              <Stars count={5} />
              <p className="text-xs text-gray-400 mt-1">Based on 500+ reviews</p>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <div key={r.name} className="bg-white border border-gray-100 rounded-2xl p-6 flex flex-col gap-4 hover:shadow-md hover:border-gray-200 transition-all">
              <div className="flex items-center justify-between">
                <Stars count={r.rating} />
                <span className="text-xs text-gray-300">{r.time}</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                <div className={`w-9 h-9 rounded-full ${r.color} flex items-center justify-center text-xs font-bold text-white flex-shrink-0`}>
                  {r.initials}
                </div>
                <div>
                  <div className="text-gray-900 text-sm font-semibold">{r.name}</div>
                  <div className="text-gray-400 text-xs">{r.device}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
