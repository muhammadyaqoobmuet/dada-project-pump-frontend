"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import StatCard from "@/components/StatCard";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [data, setData] = useState<any>(null);
  const [daily, setDaily] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(
    now.toISOString().split("T")[0],
  );

  useEffect(() => {
    api.get<any>(`/reports/monthly?year=${year}&month=${month}`).then(setData);
  }, [year, month]);

  useEffect(() => {
    api.get<any>(`/reports/daily?date=${selectedDate}`).then(setDaily);
  }, [selectedDate]);

  const fmt = (n: number) =>
    `Rs. ${Math.abs(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-xl font-bold mb-6">Reports</h1>

        {/* Daily P&L */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-base font-semibold">Daily P&L</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
          {daily && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard
                  label="Sales Revenue"
                  value={fmt(daily.totalSalesRevenue)}
                  color="blue"
                />
                <StatCard
                  label="Purchase Cost"
                  value={fmt(daily.totalPurchaseCost)}
                  color="red"
                />
                <StatCard
                  label="Expenses"
                  value={fmt(daily.totalExpenses)}
                  color="red"
                />
                <StatCard
                  label="Net Profit"
                  value={fmt(daily.netProfit)}
                  color={daily.netProfit >= 0 ? "green" : "red"}
                />
              </div>

              {/* Fuel breakdown table */}
              {Object.keys(daily.fuelBreakdown).length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">
                    Fuel-wise Breakdown
                  </h3>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-3 py-2 text-left border-b">
                          Fuel Type
                        </th>
                        <th className="px-3 py-2 text-right border-b">
                          Liters Sold
                        </th>
                        <th className="px-3 py-2 text-right border-b">
                          Revenue
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(daily.fuelBreakdown).map(
                        ([ft, d]: any) => (
                          <tr key={ft} className="border-b border-gray-100">
                            <td className="px-3 py-2 capitalize">{ft}</td>
                            <td className="px-3 py-2 text-right">
                              {d.liters.toFixed(1)}L
                            </td>
                            <td className="px-3 py-2 text-right">
                              {fmt(d.revenue)}
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Monthly overview */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-base font-semibold">Monthly Overview</h2>
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {monthNames.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {data && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <StatCard
                  label="Total Sales"
                  value={fmt(data.totalSales)}
                  color="blue"
                />
                <StatCard
                  label="Total Expenses"
                  value={fmt(data.totalExpenses)}
                  color="red"
                />
                <StatCard
                  label="Net Profit"
                  value={fmt(data.netProfit)}
                  color={data.netProfit >= 0 ? "green" : "red"}
                />
              </div>

              {/* Daily breakdown table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left border-b">Date</th>
                      <th className="px-3 py-2 text-right border-b">Sales</th>
                      <th className="px-3 py-2 text-right border-b">
                        Expenses
                      </th>
                      <th className="px-3 py-2 text-right border-b">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.dailyBreakdown)
                      .sort(([a], [b]) => b.localeCompare(a))
                      .map(([date, d]: any) => (
                        <tr
                          key={date}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-3 py-2">
                            {new Date(date).toLocaleDateString("en-PK")}
                          </td>
                          <td className="px-3 py-2 text-right text-green-700">
                            {fmt(d.sales)}
                          </td>
                          <td className="px-3 py-2 text-right text-red-600">
                            {fmt(d.expenses)}
                          </td>
                          <td
                            className={`px-3 py-2 text-right font-medium ${d.profit >= 0 ? "text-gray-800" : "text-red-600"}`}
                          >
                            {fmt(d.profit)}
                          </td>
                        </tr>
                      ))}
                    {Object.keys(data.dailyBreakdown).length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="px-3 py-6 text-center text-gray-400"
                        >
                          No data for this month
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
