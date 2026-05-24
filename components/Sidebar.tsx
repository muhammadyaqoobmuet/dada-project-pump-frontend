"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";
import { useState } from "react";
import {
  LayoutDashboard,
  BookText,
  Droplet,
  Users,
  LineChart,
  LogOut,
  Menu,
  X,
  Zap
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: BookText },
  { href: "/inventory", label: "Inventory", icon: Droplet },
  { href: "/parties", label: "Parties", icon: Users },
  { href: "/reports", label: "Reports", icon: LineChart },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname === "/login") return null;

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="flex items-center">
          <Image src="/images/headerImageWebsite.png" alt="Company Logo" width={600} height={150} className="h-10 w-auto object-contain" quality={100} priority />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <div className={`fixed inset-y-0 left-0 bg-white border-r border-slate-200 w-64 transform ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 transition-transform duration-300 ease-in-out z-40 flex flex-col md:static md:h-screen md:shrink-0`}>
        <div className="hidden md:flex items-center px-6 py-5 border-b border-slate-200">
          <Image src="/images/headerImageWebsite.png" alt="Company Logo" width={800} height={200} className="w-[180px] h-auto object-contain" quality={100} priority />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 mt-16 md:mt-0">
          {links.map((l) => {
            const isActive = pathname.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-slate-700" : "text-slate-400"}`} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 z-30 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
