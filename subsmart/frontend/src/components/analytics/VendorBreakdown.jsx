import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

import { formatINRCurrency } from "./utils.js";

const COLORS = ["#6366f1", "#a855f7", "#f97316", "#0ea5e9", "#14b8a6", "#facc15"];

function VendorBreakdown({ vendors }) {
  if (!vendors?.length) {
    return <p className="text-sm text-gray-500">No provider spend data available.</p>;
  }

  const chartData = vendors.map((vendor, index) => ({
    name: vendor.name,
    value: vendor.total_spend,
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center">
      <div className="h-48 w-full md:w-1/2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={3}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatINRCurrency(value)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="font-medium text-gray-800">{entry.name}</span>
            </div>
            <span className="text-gray-500">{formatINRCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VendorBreakdown;
