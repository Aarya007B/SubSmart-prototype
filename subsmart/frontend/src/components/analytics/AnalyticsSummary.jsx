import React from "react";
import AnalyticsCard from "./AnalyticsCard.jsx";
import SpendingSnapshot from "./SpendingSnapshot.jsx";
import StatusBreakdown from "./StatusBreakdown.jsx";
import RenewalRisk from "./RenewalRisk.jsx";
import VendorBreakdown from "./VendorBreakdown.jsx";
import TemporalTrends from "./TemporalTrends.jsx";
import Recommendations from "./Recommendations.jsx";

function AnalyticsSummary({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        Loading analytics…
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-md border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
        No analytics available yet. Add subscriptions to see insights.
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <AnalyticsCard title="Spending Snapshot" description="Top-line overview of how much you're spending on subscriptions.">
        <SpendingSnapshot spending={data.spending} />
      </AnalyticsCard>

      <AnalyticsCard title="Status & Churn Signals" description="Monitor how many subscriptions are active versus paused or cancelled.">
        <StatusBreakdown status={data.status} />
      </AnalyticsCard>

      <AnalyticsCard title="Renewal Risk" description="Upcoming renewals and overdue subscriptions to keep an eye on.">
        <RenewalRisk renewalRisk={data.renewal_risk} />
      </AnalyticsCard>

      <AnalyticsCard title="Vendor Breakdown" description="Where your money is going across providers.">
        <VendorBreakdown vendors={data.vendor_breakdown} />
      </AnalyticsCard>

      <AnalyticsCard title="Temporal Trends" description="Monthly spending and rolling averages to spot trends.">
        <TemporalTrends trends={data.temporal_trends} />
      </AnalyticsCard>

      <AnalyticsCard title="Recommendations" description="Smart suggestions to optimize your subscription stack.">
        <Recommendations recommendations={data.recommendations} />
      </AnalyticsCard>
    </div>
  );
}

export default AnalyticsSummary;
