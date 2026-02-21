"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const isLocalEnv =
  typeof process.env.NEXT_PUBLIC_ENV !== "undefined" &&
  process.env.NEXT_PUBLIC_ENV === "local";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/about", label: "About" },
];

const signedInLinks = [
  { href: "/user", label: "My Dashboard" },
];

const roleLinks = [
  { href: "/user", label: "User" },
  { href: "/admin/waitlist", label: "Admin" },
  { href: "/superadmin", label: "Superadmin" },
];

export function Header() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [dropdownOpen]);

  const isAdmin = pathname?.startsWith("/admin");
  const isSuperadmin = pathname?.startsWith("/superadmin");

  const isPublicPage =
    !isAdmin &&
    !isSuperadmin &&
    pathname !== "/user" &&
    !pathname?.startsWith("/user/");
  const currentView = isSuperadmin
    ? "Superadmin"
    : isAdmin
      ? "Admin"
      : pathname?.startsWith("/user")
        ? "User"
        : "Public (Guest)";

  const brandText = isSuperadmin
    ? "Superadmin Dashboard"
    : isAdmin
      ? "Admin Dashboard"
      : null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e9e3f5]/50 bg-white/95 backdrop-blur-sm">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href={
            isAdmin || isSuperadmin
              ? isSuperadmin
                ? "/superadmin"
                : "/admin/waitlist"
              : "/"
          }
          className="flex items-center gap-2"
        >
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#2ec4b6]">Bes</span>
            <span className="text-[#1f2937]">Living</span>
          </span>
        </Link>

        {brandText && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="text-lg font-semibold text-[#1f2937]">
              {brandText}
            </span>
          </div>
        )}

        {!isAdmin && !isSuperadmin && (
          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
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
            <SignedIn>
              {!isPublicPage &&
                signedInLinks.map((link) => (
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
            </SignedIn>
          </nav>
        )}

        <div className="flex items-center gap-4">
          <SignedOut>
            {!isAdmin && !isSuperadmin && (
              <div className="hidden gap-2 sm:flex">
                <Link
                  href="/auth"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-[#6b7280] transition-colors hover:bg-[#e9e3f5]/50 hover:text-[#8b6cb8]"
                >
                  Log in
                </Link>
                <Link
                  href="/auth"
                  className="rounded-lg bg-[#2ec4b6] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1a9b8f]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </SignedOut>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "size-9",
                },
                variables: {
                  colorPrimary: "#2ec4b6",
                },
              }}
            />
          </SignedIn>
          {isLocalEnv && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#e9e3f5] px-3 py-2 text-xs font-medium text-[#6b7280] hover:border-[#b19cd9]"
              >
                <span className="md:sr-only">Role switcher</span>
                <span className="hidden md:inline">View as:</span>
                <span className="text-[#2ec4b6]">{currentView}</span>
                <svg
                  className={`size-4 transition ${dropdownOpen ? "rotate-180" : ""}`}
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
              </button>
              {dropdownOpen && (
                <ul className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-[#e9e3f5] bg-white py-2 shadow-lg">
                  <li>
                    <Link
                      href="/"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-[#6b7280] hover:bg-[#a7f3ec]/30 hover:text-[#1a9b8f]"
                    >
                      Public (Guest)
                    </Link>
                  </li>
                  {roleLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-[#6b7280] hover:bg-[#a7f3ec]/30 hover:text-[#1a9b8f]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
