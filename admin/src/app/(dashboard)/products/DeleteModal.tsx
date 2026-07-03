"use client";

import { Trash2, X, AlertTriangle } from "lucide-react";

interface Props {
  product: { _id: string; name: string } | null;
  deleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({ product, deleting, onClose, onConfirm }: Props) {
  if (!product) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={!deleting ? onClose : undefined} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm pointer-events-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-0">
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            {!deleting && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body */}
          <div className="px-5 pt-4 pb-5">
            <h3 className="text-base font-bold text-gray-900 mb-1.5">Delete Product?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              You are about to permanently delete{" "}
              <span className="font-semibold text-gray-800">"{product.name}"</span>.
              This will also remove all images from storage. This action cannot be undone.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 px-5 pb-5">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
