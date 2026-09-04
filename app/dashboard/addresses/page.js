"use client";

import React, { useState } from "react";
import { MapPin, Trash2, Plus, Check, Loader2 } from "lucide-react";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { SkeletonRows } from "@/components/ui/skeleton";
import { useToast } from "@/app/Components/Dashboard/ToastContext";
import { NIGERIAN_STATES, SERVICE_AREA_NOTE } from "@/lib/merchant-data";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useRemoveAddressMutation,
  useUpdateAddressMutation,
} from "@/lib/api/commerceApi";
import { errorMessage } from "@/lib/api/errorMessage";

const inputCls =
  "rounded-[8px] border border-shop-border bg-white px-3 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1";

const EMPTY = {
  label: "Home",
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
};

export default function AddressesPage() {
  const showToast = useToast();
  const { data: addresses, isLoading } = useGetAddressesQuery();
  const [addAddress, addState] = useAddAddressMutation();
  const [removeAddress] = useRemoveAddressMutation();
  const [updateAddress] = useUpdateAddressMutation();

  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await addAddress(form).unwrap();
      setForm(EMPTY);
      setOpen(false);
      showToast("Address added");
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[640px]">
      <AppHeader
        title="Saved Addresses"
        backHref="/dashboard/account"
        showBackOnDesktop
      />

      <div className="flex flex-col gap-3 px-4 lg:px-0">
        {isLoading ? (
          <SkeletonRows count={2} />
        ) : (
          (addresses ?? []).map((a) => (
            <div
              key={a.id}
              className="flex items-start gap-3 rounded-[12px] border border-shop-border p-3.5"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-shop-bg">
                <MapPin
                  className="h-4 w-4 text-shop-accent-1"
                  strokeWidth={1.75}
                />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-shop-heading">
                  {a.label} · {a.name}
                  {a.isDefault && (
                    <span className="ml-2 rounded-full bg-shop-accent-1-light px-2 py-0.5 text-[10px] font-semibold text-shop-accent-1">
                      Default
                    </span>
                  )}
                </p>
                <p className="text-[12px] text-shop-text">
                  {a.line1}, {a.city}, {a.state}
                </p>
                <p className="text-[12px] text-shop-text/70">{a.phone}</p>
                <div className="mt-2 flex gap-3 text-[11.5px] font-medium">
                  {!a.isDefault && (
                    <button
                      type="button"
                      onClick={() =>
                        updateAddress({ id: a.id, ...a, isDefault: true })
                      }
                      className="flex items-center gap-1 text-shop-accent-1"
                    >
                      <Check className="h-3 w-3" /> Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAddress(a.id)}
                    className="flex items-center gap-1 text-shop-accent-3"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        {open ? (
          <form
            onSubmit={submit}
            className="flex flex-col gap-2.5 rounded-[12px] border border-shop-border p-4"
          >
            <p className="rounded-[8px] bg-shop-accent-1-light px-3 py-2 text-[11.5px] leading-[16px] text-shop-accent-1">
              {SERVICE_AREA_NOTE}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <input
                className={inputCls}
                placeholder="Label (Home)"
                value={form.label}
                onChange={set("label")}
              />
              <input
                className={inputCls}
                required
                placeholder="Full name"
                value={form.name}
                onChange={set("name")}
              />
            </div>
            <input
              className={inputCls}
              required
              placeholder="Phone"
              value={form.phone}
              onChange={set("phone")}
            />
            <input
              className={inputCls}
              required
              placeholder="Street address"
              value={form.line1}
              onChange={set("line1")}
            />
            <div className="grid grid-cols-2 gap-2.5">
              <input
                className={inputCls}
                required
                placeholder="City"
                value={form.city}
                onChange={set("city")}
              />
              <select
                className={inputCls}
                required
                value={form.state}
                onChange={set("state")}
              >
                <option value="">State</option>
                {NIGERIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            {error && <p className="text-[12px] text-red-600">{error}</p>}
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={addState.isLoading}
                className="flex items-center gap-1.5 rounded-[8px] bg-shop-accent-1 px-4 py-2 text-[12.5px] font-semibold text-white disabled:opacity-70"
              >
                {addState.isLoading && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                )}
                Save
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-[8px] border border-shop-border px-4 py-2 text-[12.5px] font-medium text-shop-heading"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex items-center justify-center gap-2 rounded-[12px] border border-dashed border-shop-border py-3 text-[13px] font-medium text-shop-accent-1"
          >
            <Plus className="h-4 w-4" /> Add address
          </button>
        )}
      </div>
    </div>
  );
}
