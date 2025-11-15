import React from "react";

function AnalyticsCard({ title, description, children }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description ? <p className="mt-1 text-sm text-gray-500">{description}</p> : null}
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default AnalyticsCard;
