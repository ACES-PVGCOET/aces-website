"use client";

import React, { useState, useEffect } from "react";
import { FormDetail } from "@/lib/types/forms";
import { getFormById } from "@/lib/api/formsApi";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { X, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface FormModalProps {
  formId?: string | null;
  initialForm?: FormDetail | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function FormModal({
  formId,
  initialForm,
  isOpen,
  onClose,
}: FormModalProps) {
  const [form, setForm] = useState<FormDetail | null>(initialForm || null);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) return;

    if (initialForm) {
      setForm(initialForm);
      setFetchError("");
      setLoading(false);
    } else if (formId) {
      setLoading(true);
      setFetchError("");
      getFormById(formId)
        .then((fetchedForm) => {
          setForm(fetchedForm);
        })
        .catch((err) => {
          console.error("[FormModal] Error loading form:", err);
          setFetchError(err.message || "Failed to load form details from server.");
        })
        .finally(() => setLoading(false));
    }
  }, [formId, initialForm, isOpen]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 w-full h-[100dvh] bg-[#070110]/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200 selection:bg-purple-600 selection:text-white">
      {/* Sticky top bar for modal controls */}
      <div className="sticky top-0 z-40 w-full bg-black/80 backdrop-blur-xl border-b border-purple-900/40 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
          {form?.title || "Form"}
        </h3>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/60 hover:bg-purple-900 text-slate-200 hover:text-white text-xs font-mono transition-all cursor-pointer"
          aria-label="Close form modal"
        >
          <X className="w-4 h-4" />
          <span>Close</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full min-h-[calc(100dvh-60px)] flex flex-col justify-start py-6 sm:py-10 px-4">
        {loading ? (
          <div className="max-w-md mx-auto my-auto p-10 rounded-2xl bg-[#0c0418] border border-purple-900/40 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-sm text-slate-300">Loading form...</p>
          </div>
        ) : fetchError ? (
          <div className="max-w-md mx-auto my-auto p-8 rounded-3xl bg-red-950/30 border border-red-900/50 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h4 className="text-base font-bold text-red-300">Unable to load form</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{fetchError}</p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (formId) {
                    setLoading(true);
                    setFetchError("");
                    getFormById(formId)
                      .then((data) => setForm(data))
                      .catch((e) => setFetchError(e.message || "Failed to load"))
                      .finally(() => setLoading(false));
                  }
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-900/50 border border-red-500/40 text-xs font-mono text-white hover:bg-red-800"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-purple-900/50 border border-purple-500/40 text-xs font-mono text-white hover:bg-purple-800"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : form ? (
          <DynamicFormRenderer form={form} mode="modal" onClose={onClose} />
        ) : null}
      </div>
    </div>
  );
}
