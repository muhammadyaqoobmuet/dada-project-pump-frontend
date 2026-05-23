"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TableSkeleton } from "@/components/Skeleton";
import { api } from "@/lib/api";
import { Plus, Download } from "lucide-react";

interface Transaction {
  _id: string;
  date: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  category: string;
  runningBalance: number;
  fuelType?: string;
  liters?: number;
  partyId?: { name: string };
}

export default function LedgerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [total, setTotal] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "",
    keyword: "",
  });

  const fetchTxns = async (p = page) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(p),
      limit: "50",
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.category && { category: filters.category }),
      ...(filters.keyword && { keyword: filters.keyword }),
    });
    const res = await api.get<any>(`/transactions?${params}`);
    setTransactions(res.transactions);
    setTotal(res.total);
    setCurrentBalance(res.currentBalance);
    setLoading(false);
  };

  useEffect(() => {
    fetchTxns();
  }, [page]);

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Delete this transaction? Running balances will be recalculated.",
      )
    )
      return;
    await api.delete(`/transactions/${id}`);
    fetchTxns();
  };

  const handleExport = async () => {
    const rows = await api.get<any[]>("/reports/export");
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => `"${r[h]}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ledger.csv";
    a.click();
  };

  const fmt = (n: number) =>
    `Rs. ${Math.abs(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  return (
    <ProtectedRoute>
      <div className="space-y-6 animate-in fade-in duration-500">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Ledger</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">All financial transactions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <Link
              href="/ledger/new"
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="mt-8">
            <TableSkeleton rows={8} />
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
             <div className="overflow-x-auto">
               {transactions.length > 0 ? (
                 <table className="w-full text-left text-sm whitespace-nowrap">
                   <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                     <tr>
                       <th className="px-5 py-4">Date</th>
                       <th className="px-5 py-4">Description</th>
                       <th className="px-5 py-4">Category</th>
                       <th className="px-5 py-4 text-right">Amount</th>
                       <th className="px-5 py-4 text-right">Balance</th>
                       <th className="px-5 py-4 w-12"></th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100/80">
                     {transactions.map((tx) => (
                       <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-5 py-4 text-slate-500 font-medium">
                           {new Date(tx.date).toLocaleDateString()}
                         </td>
                         <td className="px-5 py-4 text-slate-900 font-medium">
                           {tx.description}
                           {tx.partyId && (
                             <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                               {tx.partyId.name}
                             </span>
                           )}
                         </td>
                         <td className="px-5 py-4">
                           <span className="px-2.5 py-1 rounded bg-slate-100 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                             {tx.category.replace("_", " ")}
                           </span>
                         </td>
                         <td className={`px-5 py-4 text-right font-bold tracking-tight ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                           {tx.type === 'credit' ? '+' : '-'}{fmt(tx.amount)}
                         </td>
                         <td className="px-5 py-4 text-right font-bold text-slate-900 tracking-tight">
                           {fmt(tx.runningBalance)}
                         </td>
                         <td className="px-5 py-4 text-right">
                           <button 
                             onClick={() => handleDelete(tx._id)}
                             className="text-slate-400 hover:text-rose-600 font-medium text-xs transition-colors"
                           >
                             Delete
                           </button>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               ) : (
                 <div className="p-12 text-center">
                   <p className="text-slate-500 font-medium">No transactions found.</p>
                 </div>
               )}
             </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
