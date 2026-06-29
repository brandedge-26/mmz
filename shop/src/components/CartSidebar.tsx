"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShoppingBag } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartSidebar({ open, onClose }: Props) {
  const [visible, setVisible] = useState(false);

  // drive CSS transition
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
    }
  }, [open]);

  // lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open && !visible) return null;

  // Placeholder items — replace with cart store later
  const items: never[] = [];
  const count = items.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[150] bg-black/40 transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[160] w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-violet-600" />
            <h2 className="text-base font-bold text-gray-900">Your Cart</h2>
            {count > 0 && (
              <span className="min-w-[22px] h-[22px] bg-violet-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <div className="w-20 h-20 rounded-full bg-violet-50 flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-violet-300" />
              </div>
              <div>
                <p className="font-semibold text-gray-800">Your cart is empty</p>
                <p className="text-sm text-gray-400 mt-1">Add some products to get started</p>
              </div>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-gray-50 px-5 py-2">
              {/* cart items will go here */}
            </ul>
          )}
        </div>

        {/* Footer — shown only when items exist */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 px-5 py-5 space-y-3 bg-gray-50/60">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Subtotal</span>
              <span className="text-lg font-extrabold text-gray-900">PKR 0</span>
            </div>
            <p className="text-xs text-gray-400 text-center">Shipping &amp; taxes calculated at checkout</p>
            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold rounded-full transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              View Cart
            </Link>
            <button
              onClick={onClose}
              className="w-full py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
