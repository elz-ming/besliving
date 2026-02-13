import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-[#a7f3ec]/20 via-white to-[#e9e3f5]/30 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-[#e9e3f5] bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-bold text-[#1f2937]">Welcome back</h1>
          <p className="mt-2 text-[#6b7280]">
            Sign in to your BesLiving account
          </p>

          <form className="mt-8 space-y-6">
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
            <button
              type="submit"
              className="w-full rounded-xl bg-[#2ec4b6] py-3 font-semibold text-white transition-colors hover:bg-[#1a9b8f]"
            >
              Sign in
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[#2ec4b6] hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
