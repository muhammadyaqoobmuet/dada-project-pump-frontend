"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";

interface Party {
  _id: string;
  name: string;
}

export default function NewTransactionPage() {
  const router = useRouter();
  const [parties, setParties] = useState<Party[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    description: "",
    amount: "",
    type: "credit",
    category: "fuel_sale",
    partyId: "",
    fuelType: "petrol",
    liters: "",
    pricePerLiter: "",
    notes: "",
  });

  useEffect(() => {
    api.get<Party[]>("/parties").then(setParties);
  }, []);

  // Auto-calculate amount when liters or price changes
  useEffect(() => {
    if (
      (form.category === "fuel_sale" || form.category === "fuel_purchase") &&
      form.liters &&
      form.pricePerLiter
    ) {
      const calculated = (
        Number(form.liters) * Number(form.pricePerLiter)
      ).toFixed(0);
      setForm((f) => ({ ...f, amount: calculated }));
    }
  }, [form.liters, form.pricePerLiter]);

  // Auto-set type based on category
  useEffect(() => {
    const typeMap: Record<string, string> = {
      fuel_sale: "credit",
      fuel_purchase: "debit",
      expense: "debit",
      cash_in: "credit",
      cash_out: "debit",
      other: "credit",
    };
    setForm((f) => ({ ...f, type: typeMap[f.category] || "credit" }));
  }, [form.category]);

  const isFuelTransaction =
    form.category === "fuel_sale" || form.category === "fuel_purchase";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/transactions", {
        ...form,
        amount: Number(form.amount),
        liters: form.liters ? Number(form.liters) : undefined,
        pricePerLiter: form.pricePerLiter
          ? Number(form.pricePerLiter)
          : undefined,
        partyId: form.partyId || undefined,
      });
      router.push("/transactions");
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const set =
    (field: string) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <ProtectedRoute>
      <div className="max-w-xl">
        <h1 className="text-xl font-bold mb-6">Add Transaction</h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 bg-white border border-gray-200 rounded-lg p-6"
        >
          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={set("date")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={form.category}
              onChange={set("category")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="fuel_sale">Fuel Sale (Cash In)</option>
              <option value="fuel_purchase">Fuel Purchase (Cash Out)</option>
              <option value="expense">Expense</option>
              <option value="cash_in">Cash In (Other)</option>
              <option value="cash_out">Cash Out (Other)</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Fuel-specific fields */}
          {isFuelTransaction && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fuel Type
                </label>
                <select
                  value={form.fuelType}
                  onChange={set("fuelType")}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="cng">CNG</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Liters
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.liters}
                    onChange={set("liters")}
                    placeholder="e.g. 200"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Price per Liter (Rs.)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.pricePerLiter}
                    onChange={set("pricePerLiter")}
                    placeholder="e.g. 280"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={set("description")}
              placeholder="e.g. Sold 200L petrol to customer"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (Rs.)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.amount}
              onChange={set("amount")}
              placeholder="Auto-calculated for fuel"
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
            {isFuelTransaction && (
              <p className="text-xs text-gray-400 mt-1">
                Auto-calculated from liters × price. You can override.
              </p>
            )}
          </div>

          {/* Party */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Party / Customer (optional)
            </label>
            <select
              value={form.partyId}
              onChange={set("partyId")}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">— Cash / No Party —</option>
              {parties.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              value={form.notes}
              onChange={set("notes")}
              rows={2}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-5 py-2 rounded font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Entry"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="border border-gray-300 px-5 py-2 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </ProtectedRoute>
  );
}
