"use client";

interface StatisticsCardProps {
  title: string;
  name: string | number | undefined;
  metrics: Record<string, string | number | undefined>;
  bg?: string;
}

export default function StatisticsCard({
  title,
  name,
  metrics,
  bg = "bg-white",
}: StatisticsCardProps) {
  return (
    <div className={`p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-gradient-to-br from-pink-100 via-purple-50 to-blue-100`}>
      {/* Title */}
      <p className="text-gray-600 text-sm font-medium mb-3">{title}</p>
      
      {/* Main Value */}
      <p className="text-2xl font-bold capitalize text-gray-900 mb-4">{name || "—"}</p>
      
      {/* Metrics */}
      <div className="space-y-2">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="text-gray-500 capitalize">{key}:</span>
            <span className="font-semibold text-gray-800">{value || "—"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}