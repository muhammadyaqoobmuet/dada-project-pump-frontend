interface FuelCardProps {
  fuelType: string;
  currentStock: number;
  averageCostPrice: number;
  lowStockThreshold: number;
}

export default function FuelCard({
  fuelType,
  currentStock,
  averageCostPrice,
  lowStockThreshold,
}: FuelCardProps) {
  const isLow = currentStock <= lowStockThreshold;
  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden ${isLow ? "border-rose-300 shadow-rose-100" : "border-slate-200 shadow-slate-200/50"}`}>
      {/* Decorative top bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${isLow ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
      
      <div className="flex justify-between items-start mt-1">
        <p className="font-semibold capitalize tracking-tight text-slate-800">{fuelType}</p>
        {isLow && (
          <span className="text-[11px] font-bold tracking-wide uppercase bg-rose-50 text-rose-700 px-2 py-1 rounded-md border border-rose-100">
            Low Stock
          </span>
        )}
      </div>
      <p className="text-3xl font-bold tracking-tight text-slate-900 mt-4">
        {currentStock.toLocaleString("en-PK", { maximumFractionDigits: 0 })}
        <span className="text-sm font-medium text-slate-400 ml-1">Liters</span>
      </p>
      
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">Avg Cost</span>
          <span className="text-slate-700 font-semibold">Rs. {averageCostPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-slate-500 font-medium">Alert Level</span>
          <span className="text-slate-700 font-semibold">{lowStockThreshold}L</span>
        </div>
      </div>
    </div>
  );
}
