import { TrendingUp } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  Icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  trend?: number;
}

const KPICard = ({ title, value, Icon, color, trend }: KPICardProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md border border-slate-200 transition transform hover:shadow-xl cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-[0.85rem] font-semibold uppercase tracking-wide">
          {title}
        </span>
        <div className="text-slate-900 text-4xl font-bold">
          <Icon size={22} color={color} />
        </div>
      </div>
      <div className="text-slate-900 text-4xl font-bold">{value}</div>
      {trend && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            marginTop: "8px",
          }}
        >
          <TrendingUp size={16} color={trend > 0 ? "#10b981" : "#ef4444"} />
          <span
            style={{
              fontSize: "0.85rem",
              color: trend > 0 ? "#10b981" : "#ef4444",
            }}
          >
            {Math.abs(trend)}% vs mes anterior
          </span>
        </div>
      )}
    </div>
  );
};

export default KPICard;
