export const formatINRCurrency = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);
};

export const formatPercentage = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }
  return `${value.toFixed(1)}%`;
};
