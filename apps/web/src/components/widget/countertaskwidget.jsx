// components/StatCard.jsx
export default function StatCard({ title, value, subtitle, valueColor = "text-primary", icon: Icon, variant }) {
   const isDanger = variant === "danger";

   return (
      <div className={`relative flex min-h-[110px] flex-1 flex-col justify-between rounded-xl border p-5 shadow-xs transition-all duration-200 ${isDanger ? "border-red-200 bg-red-50/40 hover:border-red-300" : "border-primary/80 bg-white hover:border-primary/30"}`}>
         <div className="flex items-start justify-between">
            <span className={`text-lg font-medium ${isDanger ? "text-red-900" : "text-primary"}`}>{title}</span>
            {Icon && <Icon className={`h-5 w-5 ${isDanger ? "text-red-800 animate-pulse" : "text-primary"}`} />}
         </div>
         <div className="mt-1.5 flex flex-col">
            <span className={`text-3xl font-bold ${isDanger ? "text-red-800" : valueColor}`}>{value}</span>
            {subtitle && <span className={`mt-1 text-sm font-medium leading-tight ${isDanger ? "text-red-900/80" : "text-primary/80"}`}>{subtitle}</span>}
         </div>
      </div>
   );
}
