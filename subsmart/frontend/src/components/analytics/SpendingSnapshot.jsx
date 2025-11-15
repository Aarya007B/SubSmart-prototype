import React from "react";

const formatCurrency = (value) =>
  typeof value === "number" && !Number.isNaN(value)
    ? new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(value)
    : "—";

function SpendingSnapshot({ spending }) {
  if (!spending) {
    return <p className="text-sm text-gray-500">No spending data yet.</p>;
  }

  const metrics = [
    { label: "Total Monthly", value: formatCurrency(spending.total_monthly) },
    { label: "Annual Projection", value: formatCurrency(spending.annual_projection) },
    { label: "Average Price", value: formatCurrency(spending.average_price) },
    { label: "Median Price", value: formatCurrency(spending.median_price) },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-lg bg-indigo-50 p-4 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
              {metric.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-indigo-900">{metric.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-700">Top Services by Spend</h4>
        {spending.top_services?.length ? (
          <ul className="mt-3 space-y-2">
            {spending.top_services.map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between rounded-md border border-gray-200 px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-800">{service.name}</span>
                <span className="text-gray-500">{formatCurrency(service.price)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-gray-500">Add more subscriptions to see highlights.</p>
        )}
      </div>
    </div>
  );
}

export default SpendingSnapshot;
