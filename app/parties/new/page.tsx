"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { api } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewPartyPage() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const [form, setForm] = useState({
		name: "",
		type: "customer",
		phone: "",
		address: "",
		notes: "",
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		try {
			await api.post("/parties", form);
			router.push("/parties");
		} catch (err: any) {
			setError(err.message || "Failed to create party");
		} finally {
			setLoading(false);
		}
	};

	const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
		setForm((f) => ({ ...f, [field]: e.target.value }));
	};

	return (
		<ProtectedRoute>
			<div className="max-w-xl animate-in fade-in duration-500">
				<header className="mb-6 flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-slate-900">Add Party</h1>
						<p className="text-sm text-slate-500 mt-1 font-medium">Create a new customer or supplier</p>
					</div>
					<Link href="/parties" className="text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-2 text-sm font-medium">
						<ArrowLeft className="w-4 h-4" />
						Back
					</Link>
				</header>

				{error && (
					<div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm font-medium border border-rose-100">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 shadow-sm rounded-xl p-6">
					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">Name *</label>
						<input
							type="text"
							value={form.name}
							onChange={set("name")}
							placeholder="e.g. John Doe or ABC Corp"
							className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
							required
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">Type *</label>
						<select
							value={form.type}
							onChange={set("type")}
							className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow bg-white"
						>
							<option value="customer">Customer</option>
							<option value="supplier">Supplier</option>
						</select>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
						<input
							type="tel"
							value={form.phone}
							onChange={set("phone")}
							placeholder="e.g. +92 300 1234567"
							className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">Address</label>
						<input
							type="text"
							value={form.address}
							onChange={set("address")}
							placeholder="Complete address (optional)"
							className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold text-slate-700 mb-1.5">Notes</label>
						<textarea
							value={form.notes}
							onChange={set("notes")}
							placeholder="Any additional information..."
							rows={3}
							className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow resize-none"
						/>
					</div>

					<div className="pt-2">
						<button
							type="submit"
							disabled={loading}
							className="w-full bg-slate-900 text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
						>
							{loading ? "Saving..." : "Save Party"}
						</button>
					</div>
				</form>
			</div>
		</ProtectedRoute>
	);
}