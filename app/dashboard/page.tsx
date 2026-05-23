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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Overview</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </header>

        {data?.lowStockAlerts && data.lowStockAlerts.length > 0 && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-rose-800">Low Stock Alert</h3>
              <p className="text-sm text-rose-600 mt-1">
                {data.lowStockAlerts.map((a) => `${a.fuelType} is running low (${a.currentStock}L)`).join(", ")}
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <section>
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <FuelCardSkeleton />
                <FuelCardSkeleton />
              </div>
            </section>
          </>
        ) : data ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <StatCard
                label="Cash Balance"
                value={fmt(data.currentBalance)}
                color={data.currentBalance >= 0 ? "gray" : "red"}
              />
              <StatCard
                label="Today's Sales"
                value={fmt(data.todaySales)}
                color="blue"
              />
              <StatCard
                label="Today's Expenses"
                value={fmt(data.todayExpenses)}
                color="red"
              />
              <StatCard
                label="Today's Net"
                value={fmt(data.todayNet)}
                color={data.todayNet >= 0 ? "green" : "red"}
              />
            </div>

            <section>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight mb-4">Inventory Status</h2>
              {data.inventory.length === 0 ? (
                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50">
                  <p className="text-slate-500 font-medium">No inventory data available.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {data.inventory.map((inv) => (
                    <FuelCard key={inv.fuelType} {...inv} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </ProtectedRoute>
  );
}
