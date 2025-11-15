import React, { useEffect, useState } from "react";

const defaultFormState = {
  name: "",
  price: "",
  renewal_date: "",
  status: "active",
};

function SubscriptionForm({ initialData, onSubmit, onCancel, isSubmitting = false }) {
  const isEditing = Boolean(initialData);
  const [formValues, setFormValues] = useState(defaultFormState);

  useEffect(() => {
    if (initialData) {
      setFormValues({
        name: initialData.name ?? "",
        price: initialData.price ?? "",
        renewal_date: initialData.renewal_date
          ? initialData.renewal_date.slice(0, 10)
          : "",
        status: initialData.status ?? "active",
      });
    } else {
      setFormValues(defaultFormState);
    }
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formValues,
      price: parseFloat(formValues.price) || 0,
    };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md bg-white p-6 shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="name">
          Subscription Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formValues.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="price">
          Monthly Price (₹)
        </label>
        <input
          id="price"
          name="price"
          type="number"
          step="0.01"
          value={formValues.price}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="renewal_date">
          Renewal Date
        </label>
        <input
          id="renewal_date"
          name="renewal_date"
          type="date"
          value={formValues.renewal_date}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formValues.status}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={isSubmitting}
        >
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="flex items-center justify-end space-x-3">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEditing
              ? "Saving..."
              : "Adding..."
            : isEditing
            ? "Save Changes"
            : "Add Subscription"}
        </button>
      </div>
    </form>
  );
}

export default SubscriptionForm;
