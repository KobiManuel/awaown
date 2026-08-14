"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { closeModal } from "@/lib/store/modalSlice";

// variant: "sheet" slides up from the bottom (mobile-app style), "popup" fades/scales
// in centered on screen. Both are always centered at max-w-[480px] so they line up
// with the dashboard's app-frame column no matter where they're triggered from.
const ModalShell = ({ variant = "popup", children }) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    setTimeout(() => dispatch(closeModal()), 250);
  };

  const isSheet = variant === "sheet";

  return (
    <div className="fixed inset-0 z-[80] font-shop">
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />

      {isSheet ? (
        <div
          className={`absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[480px] flex-col rounded-t-[24px] bg-white p-5 pb-8 transition-transform duration-300 ${
            visible ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {typeof children === "function" ? children(close) : children}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div
            className={`w-full max-w-[340px] rounded-[20px] bg-white p-6 shadow-xl transition-all duration-300 ${
              visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          >
            {typeof children === "function" ? children(close) : children}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalShell;
