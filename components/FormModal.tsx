"use client";

import React, { useState, useEffect } from "react";
import { FormDetail, FormQuestion, FilePolicy } from "@/lib/types/forms";
import { getFormById, checkResponseExists, submitFormResponse, uploadFormFile } from "@/lib/api/formsApi";
import {
  X,
  Sparkles,
  Mail,
  AlertCircle,
  CheckCircle2,
  Send,
  UploadCloud,
  FileCheck,
  Loader2,
  FileText,
  ArrowUpRight,
  Copy,
  Check,
} from "lucide-react";

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

  const [fillerEmail, setFillerEmail] = useState<string>("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<"checking" | "exists" | "available" | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn("Failed to copy link:", err);
    }
  };

  // Fetch form details if formId is provided and form is missing
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
            <p className="text-sm font-semibold text-red-300">{fetchError}</p>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-purple-900/60 border border-purple-500/40 text-xs font-mono font-bold text-white hover:bg-purple-800"
            >
              Close Window
            </button>
          </div>
        ) : isSubmittedSuccess ? (
          /* SUCCESS SUBMISSION STATE WITH WHATSAPP GROUP & QR CODE */
          <div className="p-6 sm:p-10 text-center space-y-6 my-auto overflow-y-auto max-h-[calc(90vh-100px)]">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-300">
                Response Successfully Submitted!
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto mt-2 leading-relaxed">
                Thank you for completing &quot;<span className="font-semibold text-white">{form?.title}</span>&quot;. Your entries have been securely registered under <span className="font-mono text-emerald-400">{fillerEmail}</span>.
              </p>
            </div>

            {/* Optional WhatsApp Group & QR Code Box */}
            {(form?.whatsapp_group_link || form?.whatsapp_qr_code) && (
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 via-purple-950/20 to-black/70 border border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] max-w-md mx-auto space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84s-3.64 2.4-5.82 2.4c-1.43 0-2.83-.37-4.08-1.07l-.29-.17-3.04.8 1.15-2.95-.19-.31c-.76-1.25-1.16-2.69-1.16-4.17 0-4.54 3.7-8.24 8.24-8.24zm4.56 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.45 1.03 2.62.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.29z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white tracking-tight">Join Event WhatsApp Group</h4>
                    <p className="text-[11px] text-slate-300 font-light">
                      Get real-time alerts, team updates, and event schedules.
                    </p>
                  </div>
                </div>

                {/* QR Code (if provided) */}
                {form.whatsapp_qr_code && (
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="p-2.5 bg-white rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.3)] border border-emerald-500/30">
                      <img
                        src={form.whatsapp_qr_code}
                        alt="WhatsApp Group QR Code"
                        className="w-40 h-40 object-contain rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono mt-2">
                      Scan QR code to join group
                    </span>
                  </div>
                )}

                {/* Action Buttons for Link */}
                {form.whatsapp_group_link && (
                  <div className="space-y-2 pt-1">
                    <a
                      href={form.whatsapp_group_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
                    >
                      <span>Join WhatsApp Group</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopyLink(form.whatsapp_group_link!)}
                      className="w-full py-2 px-3 rounded-xl border border-emerald-500/30 hover:border-emerald-500/60 bg-black/40 hover:bg-emerald-950/30 text-emerald-300 text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Link Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy WhatsApp Group Link</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : form ? (
          /* FORM BODY & QUESTIONS */
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Description Banner */}
            {form.description && (
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-900/50 text-xs text-purple-200/90 leading-relaxed font-light">
                {form.description}
              </div>
            )}

            {/* Inactive Warning */}
            {!form.is_active && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>This form is currently inactive and no longer accepting new submissions.</span>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Mandatory Filler Identification Card */}
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-800/40 space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-purple-400" />
                  <span>Your Email Address</span>
                  <span className="text-red-400 font-bold">*</span>
                </span>
                <span className="text-[10px] text-purple-400/80 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-700/40">
                  Required Identification
                </span>
              </label>

              <input
                type="email"
                required
                disabled={!form.is_active}
                value={fillerEmail}
                onChange={(e) => {
                  setFillerEmail(e.target.value);
                  if (emailCheckStatus) setEmailCheckStatus(null);
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
