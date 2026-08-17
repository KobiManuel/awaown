"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Package, Eye, EyeOff, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/merchant-data";
import { addProduct, toggleProductField, removeProduct } from "@/lib/store/merchantSlice";
import AppHeader from "@/app/Components/Dashboard/AppHeader";
import { useToast } from "@/app/Components/Dashboard/ToastContext";

const Toggle = ({ on, onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
      on ? "bg-shop-accent-1" : "bg-shop-border"
    }`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
        on ? "translate-x-[22px]" : "translate-x-0.5"
      }`}
    />
  </button>
);

export default function MerchantProductsPage() {
  const dispatch = useDispatch();
  const showToast = useToast();
  const products = useSelector((s) => s.merchant.products);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !price || !stock) return;
    dispatch(
      addProduct({
        id: `mp-${Date.now()}`,
        title,
        image: null,
        price: Number(price),
        stock: Number(stock),
        status: "draft",
        offerCommission: false,
        hideStock: false,
      }),
    );
    showToast(`${title} added as a draft`);
    setTitle("");
    setPrice("");
    setStock("");
    setFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-4 pb-4 font-shop lg:mx-auto lg:w-full lg:max-w-[1100px]">
      <AppHeader
        title="Products"
        right={
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-label="Add product"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-shop-accent-1-light text-shop-accent-1 hover:bg-shop-accent-1 hover:text-white"
          >
            {formOpen ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        }
      />

      {formOpen && (
        <form
          onSubmit={handleAdd}
          className="mx-4 flex flex-col gap-3 rounded-[14px] border border-shop-border bg-shop-bg p-4 lg:mx-8"
        >
          <p className="text-[13px] font-semibold text-shop-heading">New Product</p>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
            className="rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
          />
          <div className="flex gap-3">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Price (₦)"
              inputMode="numeric"
              className="w-full rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
            <input
              value={stock}
              onChange={(e) => setStock(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="Stock"
              inputMode="numeric"
              className="w-full rounded-[8px] border border-shop-border bg-white px-3.5 py-2.5 text-[13px] text-shop-heading outline-none focus:border-shop-accent-1"
            />
          </div>
          <button
            type="submit"
            className="rounded-[8px] bg-shop-accent-1 py-2.5 text-[13px] font-semibold text-white hover:bg-shop-accent-1-dark"
          >
            Publish as Draft
          </button>
        </form>
      )}

      <div className="flex flex-col gap-3 px-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:px-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded-[14px] border border-shop-border bg-white p-3.5"
          >
            <div className="flex gap-3">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-shop-bg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-contain p-1.5"
                    sizes="64px"
                  />
                ) : (
                  <Package className="h-6 w-6 text-shop-text/40" strokeWidth={1.5} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[13px] font-medium text-shop-heading">
                  {product.title}
                </p>
                <p className="text-[13px] font-semibold text-shop-heading">
                  {formatPrice(product.price)}
                </p>
                <p className="text-[11.5px] text-shop-text/70">
                  {product.hideStock ? "Stock hidden" : `${product.stock} in stock`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                    product.status === "active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-shop-bg text-shop-text"
                  }`}
                >
                  {product.status === "active" ? "Active" : "Draft"}
                </span>
                <button
                  type="button"
                  aria-label="Remove product"
                  onClick={() => dispatch(removeProduct(product.id))}
                  className="text-shop-text/40 hover:text-shop-accent-3"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-shop-border pt-3">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-shop-heading">
                  Offer Commission
                </span>
                <Toggle
                  on={product.offerCommission}
                  onClick={() =>
                    dispatch(toggleProductField({ id: product.id, field: "offerCommission" }))
                  }
                  label="Toggle offer commission"
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  dispatch(toggleProductField({ id: product.id, field: "hideStock" }))
                }
                className="flex items-center gap-1.5 text-[12px] font-medium text-shop-text hover:text-shop-accent-1"
              >
                {product.hideStock ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
                {product.hideStock ? "Stock hidden" : "Stock visible"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
