"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TableSkeleton } from "@/components/Skeleton";
import { api } from "@/lib/api";
import { Plus } from "lucide-react";

export default function PartiesPage() {
  const [parties, setParties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<any[]>("/parties")
      .then(setParties)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) => `Rs. ${Math.abs(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  return (
    <ProtectedRoute>
      <div className="space-y-6 animate-in fade-in duration-500">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Parties</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Customer and supplier directory</p>
          </div>
          <div>
            <Link
              href="/parties/new"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Party
            </Link>
          </div>
        </header>

        {loading ? (
             <TableSkeleton rows={5} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-4">Name</th>
                      <th className="px-5 py-4">Type</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100/80">
                    {parties.map((p) => (
                      <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-4 font-bold text-slate-900">
                          {p.name}
                        </td>
                        <td className="px-5 py-4">
                           <span className={`px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider ${p.type === 'customer' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                             {p.type}
                           </span>
                        </td>
                        <td className="px-5 py-4 text-slate-600 font-medium">{p.phone || "N/A"}</td>
                        <td className="px-5 py-4 text-right font-bold tracking-tight">
                           <span className={p.balance > 0 ? "text-rose-600" : p.balance < 0 ? "text-emerald-600" : "text-slate-500"}>
                             {p.balance > 0 ? "They owe " : p.balance < 0 ? "We owe " : ""}
                             {p.balance !== 0 && fmt(p.balance)}
                             {p.balance === 0 && "Settled"}
                           </span>
                        </td>
                      </tr>
                    ))}
                    {parties.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                          No parties found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
