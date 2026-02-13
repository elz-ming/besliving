import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#a7f3ec]/40 via-[#e9e3f5]/50 to-[#fef3c7]/60">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%232ec4b6\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[#1f2937] sm:text-5xl md:text-6xl">
              Co-living that{" "}
              <span className="text-[#2ec4b6]">feels like home</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[#6b7280]">
              Find your perfect space, connect with like-minded people, and move
              in seamlessly. BesLiving makes renting simple, social, and
              stress-free.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/properties"
                className="w-full rounded-xl bg-[#2ec4b6] px-8 py-4 text-center font-semibold text-white shadow-lg shadow-[#2ec4b6]/25 transition-all hover:bg-[#1a9b8f] hover:shadow-xl hover:shadow-[#2ec4b6]/30 sm:w-auto"
              >
                Browse Spaces
              </Link>
              <Link
                href="/register"
                className="w-full rounded-xl border-2 border-[#b19cd9] bg-white/80 px-8 py-4 text-center font-semibold text-[#8b6cb8] backdrop-blur transition-all hover:bg-[#e9e3f5] sm:w-auto"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats / Social Proof */}
      <section className="border-y border-[#e9e3f5]/60 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { value: "500+", label: "Happy residents" },
              { value: "50+", label: "Premium properties" },
              { value: "24hr", label: "Move-in support" },
              { value: "98%", label: "Satisfaction rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#2ec4b6] sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-[#6b7280]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BesLiving */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-[#1f2937] sm:text-4xl">
            Why choose <span className="text-[#2ec4b6]">BesLiving</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-[#6b7280]">
            We&apos;ve reimagined co-living to put community and convenience
            first.
          </p>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🏠",
                title: "Move in hassle-free",
                desc: "Furnished rooms, utilities included. Just bring your suitcase and start your new chapter.",
                color: "yellow",
              },
              {
                icon: "🤝",
                title: "Built-in community",
                desc: "Events, shared spaces, and housemate matching so you connect with people who get you.",
                color: "turquoise",
              },
              {
                icon: "✨",
                title: "Curated quality",
                desc: "Every property is vetted for safety, comfort, and character. No surprises.",
                color: "purple",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#e9e3f5]/80 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:shadow-[#b19cd9]/10"
              >
                <div
                  className={`inline-flex size-14 items-center justify-center rounded-xl text-2xl ${
                    item.color === "yellow"
                      ? "bg-[#fef3c7]"
                      : item.color === "turquoise"
                        ? "bg-[#a7f3ec]"
                        : "bg-[#e9e3f5]"
                  }`}
                >
                  {item.icon}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-[#1f2937]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[#6b7280]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#2ec4b6] to-[#b19cd9] py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to find your space?
          </h2>
          <p className="mt-4 text-lg text-white/90">
            Join hundreds of residents who&apos;ve made BesLiving their home.
          </p>
          <Link
            href="/properties"
            className="mt-8 inline-block rounded-xl bg-white px-8 py-4 font-semibold text-[#2ec4b6] shadow-lg transition-all hover:bg-[#fef3c7] hover:text-[#d4a017]"
          >
            Explore Properties
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e9e3f5] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <span className="text-lg font-semibold text-[#2ec4b6]">
              BesLiving
            </span>
            <div className="flex gap-8 text-sm text-[#6b7280]">
              <Link href="/properties" className="hover:text-[#2ec4b6]">
                Properties
              </Link>
              <Link href="/about" className="hover:text-[#2ec4b6]">
                About
              </Link>
              <Link href="/contact" className="hover:text-[#2ec4b6]">
                Contact
              </Link>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-[#6b7280]">
            © {new Date().getFullYear()} BesLiving. Co-living made simple.
          </p>
        </div>
      </footer>
    </main>
  );
}
