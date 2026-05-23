"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { TableSkeleton } from "@/components/Skeleton";
import { api } from "@/lib/api";

export default function InventoryPage() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<any[]>("/inventory")
      .then(setInventory)
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProtectedRoute>
      <div className="space-y-6 animate-in fade-in duration-500">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Inventory</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">Real-time fuel stocks</p>
          </div>
        </header>

        {loading ? (
           <TableSkeleton rows={3} />
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-4">Fuel Type</th>
                    <th className="px-5 py-4 text-right">Current Stock</th>
                    <th className="px-5 py-4 text-right">Avg Cost Price</th>
                    <th className="px-5 py-4 text-right">Selling Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {inventory.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-900 flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${item.currentStock <= item.lowStockThreshold ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                        {item.fuelType}
                      </td>
                      <td className={`px-5 py-4 text-right font-semibold ${item.currentStock <= item.lowStockThreshold ? 'text-rose-600' : 'text-slate-700'}`}>
                        {item.currentStock.toLocaleString()} L
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700 font-medium tracking-tight">
                        Rs. {item.averageCostPrice.toFixed(2)}
                      </td>
                      <td className="px-5 py-4 text-right text-slate-700 font-medium tracking-tight">
                        Rs. {item.currentSellingPrice.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-12 text-center text-slate-500 font-medium">
                        No inventory matches found. 
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
