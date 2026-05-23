interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  color?: "green" | "red" | "blue" | "gray";
}

export default function StatCard({
  label,
  value,
  sub,
  color = "gray",
}: StatCardProps) {
  const colorMap = {
    green: "text-emerald-600 bg-emerald-50",
    red: "text-rose-600 bg-rose-50",
    blue: "text-indigo-600 bg-indigo-50",
    gray: "text-slate-600 bg-slate-50",
  };
  
  const textMap = {
    green: "text-emerald-950",
    red: "text-rose-950",
    blue: "text-indigo-950",
    gray: "text-slate-900",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm shadow-slate-200/50 hover:shadow-md transition-shadow">
      <p className="text-[13px] font-medium text-slate-500 uppercase tracking-wide mb-2 flex items-center justify-between">
        {label}
        {/* Subtle decorative dot for a modern look */}
        <span className={`w-2 h-2 rounded-full ${colorMap[color].split(' ')[1]}`}></span>
      </p>
      <p className={`text-2xl font-bold tracking-tight ${textMap[color]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-2 font-medium">{sub}</p>}
    </div>
  );
}
