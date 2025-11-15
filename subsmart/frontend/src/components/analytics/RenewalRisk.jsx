import React from "react";

import { formatINRCurrency } from "./utils.js";

function RiskSection({ title, items, emptyMessage }) {
  if (!items?.length) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 p-4 text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 text-sm">
      {items.map((item) => (
        <li key={`${item.id}-${item.renewal_date}`} className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-500">Renews on {item.renewal_date}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p className="font-semibold text-gray-900">{formatINRCurrency(item.price)}</p>
            <p className="capitalize">Status: {item.status}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function RenewalRisk({ renewalRisk }) {
  if (!renewalRisk) {
    return <p className="text-sm text-gray-500">No renewal data available.</p>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-700">Within 7 Days</h4>
        <RiskSection
          title="Within 7 Days"
          items={renewalRisk.upcoming_7_days}
          emptyMessage="No renewals in the next week."
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700">Within 30 Days</h4>
        <RiskSection
          title="Within 30 Days"
          items={renewalRisk.upcoming_30_days}
          emptyMessage="No renewals in the next 30 days."
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700">Overdue</h4>
        <RiskSection
          title="Overdue"
          items={renewalRisk.overdue}
          emptyMessage="Great job! No overdue subscriptions."
        />
      </div>
    </div>
  );
}

export default RenewalRisk;
