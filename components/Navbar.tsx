"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ledger", label: "Ledger" },
  { href: "/inventory", label: "Inventory" },
  { href: "/parties", label: "Parties" },
  { href: "/reports", label: "Reports" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/login") return null;

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <span className="font-bold text-lg">⛽ Pump Manager</span>
        <div className="flex items-center gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium ${
                pathname.startsWith(l.href)
                  ? "text-blue-600 border-b-2 border-blue-600 pb-0.5"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-800 ml-4"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
