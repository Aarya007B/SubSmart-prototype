import React from "react";

const statusStyles = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-amber-50 text-amber-700",
  cancelled: "bg-slate-100 text-slate-600",
};

function SubscriptionList({ subscriptions, onEdit, onDelete, onStatusToggle, statusMutation }) {
  if (!subscriptions.length) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No subscriptions added yet. Use the form to get started.
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "—";
    }
    try {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }).format(value);
    } catch (error) {
      return `₹${value}`;
    }
  };

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleDateString();
  };

  return (
    <ul className="space-y-4">
      {subscriptions.map((subscription) => (
        <li key={subscription.id} className="rounded-md bg-white p-5 shadow">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{subscription.name}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {formatCurrency(subscription.price)} · Renews on {formatDate(subscription.renewal_date)}
              </p>
              <span
                className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                  statusStyles[subscription.status] ?? "bg-indigo-50 text-indigo-600"
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <div className="flex shrink-0 items-center space-x-2">
              <button
                type="button"
                onClick={() => onEdit(subscription)}
                className="rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              {onStatusToggle ? (
                <button
                  type="button"
                  onClick={() => onStatusToggle(subscription)}
                  className="rounded-md border border-transparent bg-indigo-500 px-3 py-1 text-sm font-medium text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:bg-indigo-300"
                  disabled={statusMutation.loading && statusMutation.id === subscription.id}
                >
                  {statusMutation.loading && statusMutation.id === subscription.id
                    ? "Updating..."
                    : subscription.status === "active"
                    ? "Cancel"
                    : "Activate"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onDelete(subscription.id)}
                className="rounded-md border border-transparent bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SubscriptionList;
