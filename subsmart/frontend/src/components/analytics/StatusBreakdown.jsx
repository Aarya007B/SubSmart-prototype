import React from "react";

import { formatPercentage } from "./utils.js";

function StatusBreakdown({ status }) {
  if (!status || (!Object.keys(status.counts || {}).length && !Object.keys(status.percentages || {}).length)) {
    return <p className="text-sm text-gray-500">No status data available.</p>;
  }

  const statuses = Object.keys(status.counts || {}).sort();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {statuses.map((key) => (
          <div key={key} className="rounded-md bg-slate-100 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-600">{key}</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{status.counts[key] ?? 0}</p>
            <p className="text-xs text-slate-500">{formatPercentage(status.percentages[key])}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Percentages sum to 100% and reflect the share of each subscription status.
      </p>
    </div>
  );
}

export default StatusBreakdown;
