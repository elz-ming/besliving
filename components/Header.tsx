"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Find a Space" },
  { href: "/about", label: "About" },
];

const roleLinks = [
  { href: "/tenant", label: "Tenant Dashboard", role: "tenant" },
  { href: "/owner", label: "Property Owner", role: "owner" },
  { href: "/admin", label: "Admin", role: "admin" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e9e3f5]/50 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#2ec4b6]">Bes</span>
            <span className="text-[#1f2937]">Living</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#2ec4b6] ${
                pathname === link.href ? "text-[#2ec4b6]" : "text-[#6b7280]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden gap-2 sm:flex">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#e9e3f5]/50 hover:text-[#8b6cb8]"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a9b8f]"
            >
              Get Started
            </Link>
          </div>
          <details className="group relative">
            <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e9e3f5] px-3 py-2 text-xs font-medium text-[#6b7280] hover:border-[#b19cd9] md:cursor-default">
              <span className="md:sr-only">Role switcher</span>
              <span className="hidden md:inline">View as:</span>
              <span className="text-[#2ec4b6]">Guest</span>
              <svg
                className="size-4 transition group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <ul className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[#e9e3f5] bg-white py-2 shadow-lg">
              <li>
                <Link
                  href="/"
                  className="block px-4 py-2 text-sm text-[#6b7280] hover:bg-[#a7f3ec]/30 hover:text-[#1a9b8f]"
                >
                  Potential Client (Guest)
                </Link>
              </li>
              {roleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-sm text-[#6b7280] hover:bg-[#a7f3ec]/30 hover:text-[#1a9b8f]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </header>
  );
}
