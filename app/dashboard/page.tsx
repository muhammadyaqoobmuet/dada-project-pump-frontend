"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import FuelCard from "@/components/FuelCard";
import { StatCardSkeleton, FuelCardSkeleton, Skeleton } from "@/components/Skeleton";
import { api } from "@/lib/api";
import { AlertCircle } from "lucide-react";

interface DashboardData {
  currentBalance: number;
  todaySales: number;
  todayExpenses: number;
  todayNet: number;
  todayFuelSalesLiters: number;
  inventory: Array<{
    fuelType: string;
    currentStock: number;
    averageCostPrice: number;
    lowStockThreshold: number;
  }>;
  lowStockAlerts: Array<{ fuelType: string; currentStock: number }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<DashboardData>("/reports/dashboard")
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (n: number) =>
    `Rs. ${n.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  return (
    <ProtectedRoute>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Overview</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {loading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="grid lg:grid-cols-3 gap-6 mt-6">
              <div className="col-span-2">
                <Skeleton className="h-6 w-32 mb-4" />
                <div className="grid gap-4">
                  <FuelCardSkeleton />
                  <FuelCardSkeleton />
                </div>
              </div>
            </div>
          </>
        ) : data ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Cash Balance</p>
                <p className={`text-2xl font-semibold mt-2 tracking-tight ${data.currentBalance >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>{fmt(data.currentBalance)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Today's Sales</p>
                <p className="text-2xl text-slate-900 font-semibold mt-2 tracking-tight">{fmt(data.todaySales)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Today's Expenses</p>
                <p className="text-2xl text-slate-900 font-semibold mt-2 tracking-tight">{fmt(data.todayExpenses)}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Today's Net</p>
                <p className={`text-2xl font-semibold mt-2 tracking-tight ${data.todayNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmt(data.todayNet)}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

              {/* Inventory (bigger focus) */}
              <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-slate-900">Inventory Status</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Live</span>
                </div>

                <div className="space-y-4">
                  {data.inventory.length === 0 ? (
                    <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                      <p className="text-slate-500 font-medium text-sm">No inventory data available.</p>
                    </div>
                  ) : (
                    data.inventory.map((inv) => {
                      const maxCapacity = Math.max(inv.currentStock * 1.5, inv.lowStockThreshold * 3, 5000); // Guessed max capacity for visual progress
                      const stockPercent = Math.min((inv.currentStock / maxCapacity) * 100, 100);
                      const isLow = inv.currentStock <= inv.lowStockThreshold;

                      return (
                        <div key={inv.fuelType} className={`p-5 rounded-lg border ${isLow ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-sm font-medium text-slate-500 capitalize">{inv.fuelType}</p>
                              <p className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                                {inv.currentStock.toLocaleString("en-PK", { maximumFractionDigits: 0 })} L
                              </p>
                            </div>

                            <div className="text-right text-sm">
                              <p className="text-slate-500 font-medium">Avg Cost</p>
                              <p className="font-semibold text-slate-900 mt-1">Rs. {inv.averageCostPrice.toFixed(2)}</p>
                            </div>
                          </div>

                          {/* Progress indicator */}
                          <div className="mt-5 h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-1000 ${isLow ? 'bg-rose-500' : 'bg-blue-500'}`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>

                          <div className="flex justify-between items-center mt-3">
                            <p className="text-xs font-medium text-slate-500">
                              Alert Level: {inv.lowStockThreshold} L
                            </p>
                            {isLow && (
                              <p className="text-xs font-bold text-rose-600 tracking-wide uppercase">
                                Action Required
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right panel (alerts / quick stats) */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm h-fit">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Insights</h3>

                <div className="space-y-4 text-sm">
                  <div className={`p-4 rounded-xl border ${data.lowStockAlerts && data.lowStockAlerts.length > 0 ? 'bg-rose-50 border-rose-200' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="font-medium text-slate-900">Low stock alerts</p>
                    {data.lowStockAlerts && data.lowStockAlerts.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {data.lowStockAlerts.map(a => (
                          <p key={a.fuelType} className="text-xs font-medium text-rose-600 capitalize">
                            • {a.fuelType} ({a.currentStock}L remaining)
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-slate-500 mt-1">No alerts</p>
                    )}
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="font-medium text-slate-900">Daily performance</p>
                    <p className={`text-xs mt-2 font-semibold ${data.todayNet >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {data.todayNet >= 0 ? 'Stable (Profitable)' : 'Running at a loss today'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="font-medium text-slate-900">Fuel moved today</p>
                    <p className="text-lg font-bold tracking-tight text-slate-700 mt-1">{data.todayFuelSalesLiters || 0} L</p>
                  </div>
                </div>
              </div>

            </div>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
