import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

import { formatINRCurrency } from "./utils.js";

function TemporalTrends({ trends }) {
  if (!trends || (!trends.monthly_totals?.length && !trends.rolling_average?.length)) {
    return <p className="text-sm text-gray-500">Trend data will appear once renewals are tracked over time.</p>;
  }

  const chartData = (trends.monthly_totals || []).map((entry) => {
    const rolling = trends.rolling_average?.find((avg) => avg.month === entry.month);
    return {
      month: entry.month,
      total: entry.total,
      rolling: rolling ? rolling.average : null,
    };
  });

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 16, right: 24, left: 8, bottom: 12 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(value) => formatINRCurrency(value)} tick={{ fontSize: 12 }} width={100} />
          <Tooltip formatter={(value) => formatINRCurrency(value)} labelStyle={{ fontWeight: 600 }} />
          <Legend />
          <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={2} dot={false} name="Monthly Total" />
          <Line type="monotone" dataKey="rolling" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} name="3-Month Avg" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TemporalTrends;
