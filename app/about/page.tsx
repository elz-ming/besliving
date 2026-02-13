export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-[#1f2937]">About BesLiving</h1>
        <p className="mt-4 text-lg text-[#6b7280]">
          We believe that where you live shapes who you become. BesLiving connects
          people who want more than just a room—they want a community.
        </p>

        <div className="mt-16 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold text-[#2ec4b6]">Our mission</h2>
            <p className="mt-2 text-[#6b7280]">
              To make co-living accessible, transparent, and delightful. We
              curate properties and match tenants so everyone can thrive in a
              supportive environment.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-[#b19cd9]">For everyone</h2>
            <p className="mt-2 text-[#6b7280]">
              Whether you&apos;re a tenant looking for your next home, a property
              owner wanting to fill spaces, or an admin managing operations—we
              build tools that put people first.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
