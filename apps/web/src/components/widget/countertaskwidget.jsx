// components/StatCard.jsx
export default function StatCard({ title, value, subtitle, valueColor = "text-primary", icon: Icon }) {
   return (
      <div className="relative flex min-h-[110px] flex-1 flex-col justify-between rounded-xl border border-primary/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-primary/30">
         <div className="flex items-start justify-between">
            <span className="text-lg font-medium text-primary">{title}</span>
            {Icon && <Icon className="h-5 w-5 text-primary" />}
         </div>
         <div className="mt-1.5 flex flex-col">
            <span className={`text-3xl font-bold ${valueColor}`}>{value}</span>
            {subtitle && <span className="mt-1 text-sm font-medium text-primary/80 leading-tight">{subtitle}</span>}
         </div>
      </div>
   );
}
