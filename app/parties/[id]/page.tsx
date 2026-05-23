"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

export default function PartyDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get<any>(`/parties/${id}/transactions`).then(setData);
  }, [id]);

  const fmt = (n: number) =>
    `Rs. ${Math.abs(n).toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;

  return (
    <ProtectedRoute>
      <div>
        {data && (
          <>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold">{data.party?.name}</h1>
                <p className="text-sm text-gray-500 capitalize">
                  {data.party?.type} · {data.party?.phone}
                </p>
              </div>
              <div
                className={`text-right font-bold text-lg ${data.party?.currentBalance > 0 ? "text-green-700" : "text-red-600"}`}
              >
                {data.party?.currentBalance === 0
                  ? "Settled"
                  : `${data.party?.currentBalance > 0 ? "Owes" : "We owe"} ${fmt(data.party?.currentBalance)}`}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-3 py-2 border-b">Date</th>
                    <th className="px-3 py-2 border-b">Description</th>
                    <th className="px-3 py-2 border-b text-right">Amount</th>
                    <th className="px-3 py-2 border-b text-right">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.transactions?.map((tx: any) => (
                    <tr
                      key={tx._id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-3 py-2">
                        {new Date(tx.date).toLocaleDateString("en-PK")}
                      </td>
                      <td className="px-3 py-2">{tx.description}</td>
                      <td
                        className={`px-3 py-2 text-right ${tx.type === "credit" ? "text-green-700" : "text-red-600"}`}
                      >
                        {tx.type === "credit" ? "+" : "-"}
                        {fmt(tx.amount)}
                      </td>
                      <td className="px-3 py-2 text-right font-medium">
                        {fmt(tx.runningBalance)}
                      </td>
                    </tr>
                  ))}
                  {data.transactions?.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-6 text-center text-gray-400"
                      >
                        No transactions
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
