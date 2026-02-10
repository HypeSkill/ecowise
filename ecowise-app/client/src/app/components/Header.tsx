"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";
import React from "react";

interface HeaderProps {
  userName?: string | null;
  avatarUrl?: string | null;
}

export default function Header({ userName, avatarUrl }: HeaderProps) {
  return (
    <header className="w-full flex items-center justify-between border-b px-6 md:px-10 py-3 border-primary/10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Image
  src="/assets/logo-v2.png"
  alt="Logo"
  width={28}
  height={28}
  className="rounded-md"
/>

        </div>
        <h2 className="text-lg font-bold text-site">EcoWise</h2>
      </div>

      <nav className="sticky top-4 z-50 w-full flex justify-center">
  <div
    className="
      isolate
      flex items-center gap-10
      px-8 h-14
      rounded-full
      bg-white dark:bg-slate-900
      border border-slate-300 dark:border-slate-700
      shadow-md
    "
  >
    {/* Navigation links */}
    <Link
      href="/"
      className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
    >
      Home
    </Link>

    <Link
      href="/trips"
      className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
    >
      Trips
    </Link>

    <Link
      href="/dashboard/trips"
      className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
    >
      Planner
    </Link>

    <Link
      href="/dashboard/saved-trips"
      className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-emerald-600 transition"
    >
      Saved
    </Link>

    {/* Sign in */}
    <Link
      href="/login"
      className="
        ml-4
        rounded-full
        px-5 py-2
        text-sm font-bold
        bg-emerald-600 text-white
        hover:bg-emerald-700
        shadow-sm
        transition
      "
    >
      Sign in
    </Link>
  </div>
</nav>


      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="hidden sm:inline-flex items-center justify-center rounded-lg h-9 px-3 bg-card text-site text-sm font-medium shadow-sm">
          Help
        </button>
        <div
          className="w-10 h-10 rounded-full bg-center bg-cover"
          style={{
            backgroundImage: `url(${avatarUrl || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none"><rect width="100%" height="100%" rx="12" fill="%23E5E7EB"/><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-4 0-6 2-6 4v1h12v-1c0-2-2-4-6-4z" fill="%23808080"/></svg>'})`,
          }}
        />
        {userName && <span className="hidden md:inline text-site font-medium ml-2">{userName}</span>}
      </div>
    </header>
  );
}
