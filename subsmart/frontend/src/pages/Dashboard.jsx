import React, { useEffect, useMemo, useState } from "react";

import SubscriptionForm from "../components/SubscriptionForm.jsx";
import SubscriptionList from "../components/SubscriptionList.jsx";
import {
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  updateSubscription,
  updateSubscriptionStatus,
  extractErrorMessage,
  fetchAnalytics,
} from "../api.js";
import AnalyticsSummary from "../components/analytics/AnalyticsSummary.jsx";

const initialSubscriptions = [
  {
    id: 1,
    name: "Disney+ Hotstar",
    price: 1499,
    renewal_date: new Date().toISOString(),
    status: "active",
  },
  {
    id: 2,
    name: "Spotify Premium",
    price: 119,
    renewal_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: "cancelled",
  },
];

function Dashboard() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMutation, setStatusMutation] = useState({ id: null, loading: false });
  const [analytics, setAnalytics] = useState(null);
  const [analyticsError, setAnalyticsError] = useState(null);

  useEffect(() => {
    const loadSubscriptions = async () => {
      try {
        const data = await fetchSubscriptions();
        setSubscriptions(data);
      } catch (apiError) {
        console.warn("Falling back to placeholder data due to API error", apiError);
        setSubscriptions(initialSubscriptions);
        setError("Unable to reach the server. Showing placeholder data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscriptions();
  }, []);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const summary = await fetchAnalytics();
        setAnalytics(summary);
        setAnalyticsError(null);
      } catch (apiError) {
        console.error("Analytics fetch failed", apiError);
        setAnalyticsError(extractErrorMessage(apiError));
      }
    };

    loadAnalytics();
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
      }),
    []
  );

  const totalMonthlyCost = useMemo(() => {
    return subscriptions.reduce((sum, subscription) => sum + (subscription.price || 0), 0);
  }, [subscriptions]);

  const formattedMonthlyCost = currencyFormatter.format(totalMonthlyCost);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleSuccess = (message, updater) => {
    setSubscriptions((prev) => (typeof updater === "function" ? updater(prev) : updater));
    setEditingSubscription(null);
    clearMessages();
    setSuccess(message);
    refreshAnalytics();
  };

  const refreshAnalytics = async () => {
    try {
      const summary = await fetchAnalytics();
      setAnalytics(summary);
      setAnalyticsError(null);
    } catch (apiError) {
      setAnalyticsError(extractErrorMessage(apiError));
    }
  };

  const handleCreate = async (payload) => {
    clearMessages();
    setIsSubmitting(true);
    try {
      const created = await createSubscription(payload);
      handleSuccess("Subscription added", (prev) => [...prev, created]);
    } catch (apiError) {
      console.error("Create failed", apiError);
      setError(extractErrorMessage(apiError));
    }
    setIsSubmitting(false);
  };

  const handleUpdate = async (payload) => {
    if (!editingSubscription) {
      return;
    }
    clearMessages();
    setIsSubmitting(true);
    try {
      const updated = await updateSubscription(editingSubscription.id, payload);
      handleSuccess("Subscription updated", (prev) =>
        prev.map((item) => (item.id === editingSubscription.id ? updated : item))
      );
    } catch (apiError) {
      console.error("Update failed", apiError);
      setError(extractErrorMessage(apiError));
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this subscription?")) {
      return;
    }
    clearMessages();
    try {
      await deleteSubscription(id);
      handleSuccess("Subscription deleted", (prev) => prev.filter((item) => item.id !== id));
    } catch (apiError) {
      console.error("Delete failed", apiError);
      setError(extractErrorMessage(apiError));
    }
  };

  const handleSubmit = (payload) => {
    if (editingSubscription) {
      handleUpdate(payload);
    } else {
      handleCreate(payload);
    }
  };

  const handleStatusToggle = async (subscription) => {
    const nextStatus = subscription.status === "active" ? "cancelled" : "active";
    if (
      !window.confirm(
        nextStatus === "cancelled"
          ? "Cancel this subscription? You can reactivate it later."
          : "Reactivate this subscription?"
      )
    ) {
      return;
    }

    clearMessages();
    setStatusMutation({ id: subscription.id, loading: true });
    try {
      const updated = await updateSubscriptionStatus(subscription.id, nextStatus);
      handleSuccess(`Subscription ${nextStatus}`, (prev) =>
        prev.map((item) => (item.id === subscription.id ? updated : item))
      );
    } catch (apiError) {
      console.error("Status toggle failed", apiError);
      setError(extractErrorMessage(apiError));
    }
    setStatusMutation({ id: null, loading: false });
  };

  const handleEdit = (subscription) => {
    clearMessages();
    setEditingSubscription(subscription);
  };

  const handleCancelEdit = () => {
    clearMessages();
    setEditingSubscription(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SubSmart Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            Track and manage all your online subscriptions in one place.
          </p>
        </div>
        <div className="rounded-md bg-indigo-50 px-5 py-3 text-indigo-700 shadow-sm">
          <p className="text-sm font-medium">Monthly Spend</p>
          <p className="text-2xl font-semibold">{formattedMonthlyCost}</p>
        </div>
      </header>

      {error ? (
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-md border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-2">
        <SubscriptionForm
          initialData={editingSubscription}
          onSubmit={handleSubmit}
          onCancel={editingSubscription ? handleCancelEdit : undefined}
          isSubmitting={isSubmitting}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Your Subscriptions</h2>
            {isLoading ? <span className="text-sm text-gray-500">Loading...</span> : null}
          </div>
          <SubscriptionList
            subscriptions={subscriptions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusToggle={handleStatusToggle}
            statusMutation={statusMutation}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Analytics & Insights</h2>
          <button
            type="button"
            onClick={refreshAnalytics}
            className="rounded-md border border-indigo-500 px-3 py-1 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
          >
            Refresh
          </button>
        </div>
        {analyticsError ? (
          <div className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {analyticsError}
          </div>
        ) : null}
        <AnalyticsSummary data={analytics} isLoading={!analytics && !analyticsError} />
      </section>
    </div>
  );
}

export default Dashboard;
