import Link from "next/link";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#e9e3f5]/30 via-white to-[#a7f3ec]/20 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#e9e3f5] bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-[#1f2937]">Join BesLiving</h1>
          <p className="mt-2 text-[#6b7280]">
            Create an account to find your perfect co-living space
          </p>

          <form className="mt-8 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#1f2937]"
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20"
                placeholder="Alex Johnson"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1f2937]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1f2937]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-2 w-full rounded-xl border border-[#e9e3f5] px-4 py-3 focus:border-[#2ec4b6] focus:outline-none focus:ring-2 focus:ring-[#2ec4b6]/20"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1f2937]">
                I am a
              </label>
              <div className="mt-2 flex gap-4">
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="tenant"
                    defaultChecked
                    className="accent-[#2ec4b6]"
                  />
                  <span className="text-sm text-[#6b7280]">Tenant</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="owner"
                    className="accent-[#2ec4b6]"
                  />
                  <span className="text-sm text-[#6b7280]">Property owner</span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2ec4b6] py-3 font-semibold text-white transition-colors hover:bg-[#1a9b8f]"
            >
              Create account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#2ec4b6] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
