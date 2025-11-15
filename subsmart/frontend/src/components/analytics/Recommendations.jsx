import React from "react";

import { formatINRCurrency } from "./utils.js";

function RecommendationList({ title, items, renderItem, emptyMessage }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-700">{title}</h4>
      {items?.length ? (
        <ul className="mt-2 space-y-2 text-sm">
          {items.map((item, index) => (
            <li key={item.id ?? item.service ?? index} className="rounded-md border border-gray-200 px-3 py-2">
              {renderItem(item)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
      )}
    </div>
  );
}

function Recommendations({ recommendations }) {
  if (!recommendations) {
    return <p className="text-sm text-gray-500">No recommendations yet.</p>;
  }

  return (
    <div className="space-y-4">
      <RecommendationList
        title="Duplicate Services"
        items={recommendations.duplicates}
        emptyMessage="No duplicate services detected."
        renderItem={(item) => (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{item.service}</p>
              <p className="text-xs text-gray-500">Subscriptions: {item.subscription_ids.join(", ")}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Total spend: {formatINRCurrency(item.total_spend)}</p>
              <p>Duplicates: {item.count}</p>
            </div>
          </div>
        )}
      />

      <RecommendationList
        title="High-Cost Subscriptions"
        items={recommendations.downgrade_candidates}
        emptyMessage="No high-cost subscriptions flagged."
        renderItem={(item) => (
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">Subscription ID: {item.id}</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Price: {formatINRCurrency(item.price)}</p>
              <p className="text-xs text-amber-600">{item.note}</p>
            </div>
          </div>
        )}
      />

      <div className="rounded-md border border-dashed border-gray-200 p-4 text-xs text-gray-500">
        {recommendations.notes}
      </div>
    </div>
  );
}

export default Recommendations;
