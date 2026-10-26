"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FormDetail, FormQuestion, FilePolicy } from "@/lib/types/forms";
import { checkResponseExists, submitFormResponse, uploadFormFile } from "@/lib/api/formsApi";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  UploadCloud,
  ExternalLink,
  Send,
  ArrowUpRight,
  Copy,
  Check,
  ShoppingCart,
  QrCode,
  CreditCard,
  RotateCcw,
  Receipt,
} from "lucide-react";

interface DynamicFormRendererProps {
  form: FormDetail;
  mode?: "page" | "modal";
  onClose?: () => void;
}

export default function DynamicFormRenderer({
  form,
  mode = "page",
  onClose,
}: DynamicFormRendererProps) {
  const [fillerEmail, setFillerEmail] = useState<string>("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<"checking" | "exists" | "available" | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [checkoutSelections, setCheckoutSelections] = useState<Record<string, number[]>>({});
  const [activeQrSource, setActiveQrSource] = useState<Record<string, "primary" | "fallback">>({});

  const handleCopyLink = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn("Failed to copy link:", err);
    }
  };

  useEffect(() => {
    if (!form?.questions) return;
    const initial: Record<string, string[]> = {};
    form.questions.forEach((q) => {
      initial[String(q.question_serial)] = [];
    });
    setAnswersMap(initial);
  }, [form]);

  // Check email uniqueness
  const handleEmailBlur = async (emailVal: string) => {
    const trimmed = emailVal.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || !form?.form_id) {
      setEmailCheckStatus(null);
      return;
    }

    try {
      setEmailCheckStatus("checking");
      const exists = await checkResponseExists(form.form_id, trimmed);
      if (exists) {
        setEmailCheckStatus("exists");
      } else {
        setEmailCheckStatus("available");
      }
    } catch {
      setEmailCheckStatus(null);
    }
  };

  const handleTextChange = (serial: number, value: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [String(serial)]: value ? [value] : [],
    }));
  };

  const handleSingleChoice = (serial: number, option: string) => {
    setAnswersMap((prev) => ({
      ...prev,
      [String(serial)]: [option],
    }));
  };

  const handleMultipleChoiceToggle = (serial: number, option: string) => {
    const key = String(serial);
    const current = answersMap[key] || [];
    const exists = current.includes(option);
    const updated = exists ? current.filter((item) => item !== option) : [...current, option];
    setAnswersMap((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const handleToggleCheckoutItem = (serial: number, itemIdx: number) => {
    const key = String(serial);
    const current = checkoutSelections[key] || [];
    const exists = current.includes(itemIdx);
    const updated = exists ? current.filter((idx) => idx !== itemIdx) : [...current, itemIdx];
    setCheckoutSelections((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const handleSelectAllCheckoutItems = (serial: number, count: number) => {
    const key = String(serial);
    const allIndices = Array.from({ length: count }, (_, i) => i);
    setCheckoutSelections((prev) => ({
      ...prev,
      [key]: allIndices,
    }));
  };

  const handleClearCheckoutItems = (serial: number) => {
    const key = String(serial);
    setCheckoutSelections((prev) => ({
      ...prev,
      [key]: [],
    }));
  };

  const toggleQrSource = (serial: number) => {
    const key = String(serial);
    setActiveQrSource((prev) => ({
      ...prev,
      [key]: prev[key] === "fallback" ? "primary" : "fallback",
    }));
  };

  const handleFileUpload = async (serial: number, file?: File, filePolicy?: FilePolicy) => {
    if (!file) return;

    const maxMb = filePolicy?.max_size_mb || 5;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`File exceeds maximum allowed limit of ${maxMb}MB.`);
      return;
    }

    const supportedTypes = (filePolicy?.supported_types || []).map((t) => t.toLowerCase().replace(/^\./, ""));
    if (supportedTypes.length > 0) {
      const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "" : "";
      if (!supportedTypes.includes(ext)) {
        setErrorMsg(`File extension .${ext} is not allowed. Supported type(s): ${supportedTypes.join(", ")}`);
        return;
      }
    }

    const serialKey = String(serial);
    try {
      setErrorMsg("");
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: true }));
      const uploadRes = await uploadFormFile(file);

      setAnswersMap((prev) => ({
        ...prev,
        [serialKey]: [uploadRes.url],
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "File upload failed. Please try again.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: false }));
    }
  };

  const handlePaymentScreenshotUpload = async (serial: number, file?: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Screenshot exceeds maximum allowed limit of 10MB.");
      return;
    }

    const ext = file.name.includes(".") ? file.name.split(".").pop()?.toLowerCase() || "" : "";
    const allowed = ["png", "jpg", "jpeg", "webp", "pdf"];
    if (!allowed.includes(ext)) {
      setErrorMsg(`File type must be an image or PDF (${allowed.join(", ")}).`);
      return;
    }

    const serialKey = String(serial);
    try {
      setErrorMsg("");
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: true }));
      const uploadRes = await uploadFormFile(file);

      setAnswersMap((prev) => ({
        ...prev,
        [serialKey]: [uploadRes.url],
      }));
    } catch (err: any) {
      setErrorMsg(err.message || "Payment screenshot upload failed. Please try again.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form) return;

    const trimmedEmail = fillerEmail.trim();
    if (!trimmedEmail) {
      setErrorMsg("Email address is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (emailCheckStatus === "exists") {
      setErrorMsg("A response has already been submitted with this email address.");
      return;
    }

    if (Object.values(uploadingFiles).some(Boolean)) {
      setErrorMsg("Please wait for file uploads to complete.");
      return;
    }

    // Check required questions
    for (const q of form.questions || []) {
      const serialKey = String(q.question_serial);
      const answerArr = answersMap[serialKey] || [];
      const qType = (q.question_type || "").toLowerCase();

      if (qType === "payment_checkout") {
        const selected = checkoutSelections[serialKey] || [];
        if (q.is_required && selected.length === 0) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Please select at least one item.`);
          const element = document.getElementById(`question-card-${q.question_serial}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        if (q.is_required && (!answerArr || answerArr.length === 0 || !answerArr[0]?.trim())) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Please upload your payment confirmation screenshot.`);
          const element = document.getElementById(`question-card-${q.question_serial}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
        if (selected.length > 0 && (!answerArr || answerArr.length === 0 || !answerArr[0]?.trim())) {
          setErrorMsg(`Question #${q.question_serial}: You have selected item(s). Please upload your payment confirmation screenshot before submitting.`);
          const element = document.getElementById(`question-card-${q.question_serial}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
      } else if (qType === "payment_acceptance") {
        if (q.is_required && (!answerArr || answerArr.length === 0 || !answerArr[0]?.trim())) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Payment confirmation screenshot is required.`);
          const element = document.getElementById(`question-card-${q.question_serial}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
          return;
        }
      } else if (q.is_required && (answerArr.length === 0 || !answerArr[0]?.trim())) {
        setErrorMsg(`"${q.question_statement}" is required.`);
        const element = document.getElementById(`question-card-${q.question_serial}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }
    }

    try {
      setIsSubmitting(true);
      await submitFormResponse(form.form_id, {
        email: trimmedEmail,
        answers: answersMap,
      });
      setIsSubmittedSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit form response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS SUBMISSION VIEW
  if (isSubmittedSuccess) {
    return (
      <div className="w-full max-w-2xl mx-auto py-8">
        <div className="rounded-2xl bg-[#0c0418] border border-purple-900/40 p-6 sm:p-10 text-center space-y-6 text-slate-100 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Response Submitted</h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Your response for <span className="font-medium text-white">{form.title}</span> has been successfully recorded.
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

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            {mode === "modal" && onClose ? (
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            ) : (
              <>
                <Link
                  href="/forms"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold uppercase tracking-wider transition-all text-center"
                >
                  All Forms
                </Link>
                <Link
                  href="/"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-purple-900/50 hover:bg-purple-950/40 text-slate-300 text-xs font-semibold uppercase tracking-wider transition-all text-center"
                >
                  Home
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto text-slate-100 relative">
      
      {/* SUBMISSION LOADING OVERLAY */}
      {isSubmitting && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-150">
          <div className="p-8 rounded-2xl bg-[#0c0418] border border-purple-800/40 flex flex-col items-center space-y-4 shadow-2xl">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <div className="space-y-1">
              <p className="text-base font-semibold text-white">Submitting your response...</p>
              <p className="text-xs text-slate-400 font-mono">Please do not refresh the page</p>
            </div>
          </div>
        </div>
      )}

      {/* FORM CARD */}
      <div className="rounded-2xl bg-[#0c0418] border border-purple-900/40 shadow-xl overflow-hidden">
        
        {/* FORM TITLE & DESCRIPTION */}
        <div className="p-6 sm:p-8 border-b border-purple-900/40 space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {form.title}
          </h1>

          {form.description && (
            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed whitespace-pre-line">
              {form.description}
            </p>
          )}

          {!form.is_active && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 mt-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>This form is no longer accepting responses.</span>
            </div>
          )}
        </div>

        {/* ERROR NOTIFICATION */}
        {errorMsg && (
          <div className="mx-6 sm:mx-8 mt-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* FORM FIELDS */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          
          {/* EMAIL IDENTIFICATION */}
          <div className="space-y-2">
            <label htmlFor="filler-email" className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-medium">
              Email Address <span className="text-red-400">*</span>
            </label>
            <input
              id="filler-email"
              type="email"
              required
              disabled={!form.is_active || isSubmitting}
              value={fillerEmail}
              onChange={(e) => {
                setFillerEmail(e.target.value);
                if (emailCheckStatus) setEmailCheckStatus(null);
              }}
              onBlur={(e) => handleEmailBlur(e.target.value)}
              placeholder="Enter your email"
              className={`w-full px-3.5 py-2.5 rounded-xl bg-black/50 border text-base sm:text-sm font-sans text-slate-100 placeholder:text-slate-500 focus:outline-none transition-all ${
                emailCheckStatus === "exists"
                  ? "border-red-500 text-red-300 bg-red-500/10"
                  : emailCheckStatus === "available"
                  ? "border-emerald-500/60 text-emerald-300"
                  : "border-purple-900/50 focus:border-purple-500"
              }`}
            />
            {emailCheckStatus === "checking" && (
              <p className="text-[11px] font-mono text-purple-300">Checking email record...</p>
            )}
            {emailCheckStatus === "exists" && (
              <p className="text-[11px] font-mono text-red-400">
                A response has already been submitted with this email.
              </p>
            )}
          </div>

          {/* QUESTIONS LIST */}
          {(form.questions || [])
            .sort((a, b) => (a.question_serial || 0) - (b.question_serial || 0))
            .map((q) => {
              const serialKey = String(q.question_serial);
              const currentAns = answersMap[serialKey] || [];

              return (
                <div
                  key={q.question_serial}
                  id={`question-card-${q.question_serial}`}
                  className="space-y-2.5 pt-4 border-t border-purple-900/30"
                >
                  <label className="block text-sm sm:text-base font-medium text-slate-200 leading-snug">
                    <span className="text-purple-400 font-mono mr-1.5">{q.question_serial}.</span>
                    <span>{q.question_statement}</span>
                    {q.is_required && <span className="text-red-400 ml-1 font-bold">*</span>}
                  </label>

                  {/* Question image */}
                  {q.image_url && (
                    <div className="rounded-xl overflow-hidden border border-purple-900/40 bg-black/40 p-2 my-2 flex items-center justify-center">
                      <img
                        src={q.image_url}
                        alt={`Question ${q.question_serial}`}
                        className="max-h-64 w-auto object-contain rounded-lg"
                      />
                    </div>
                  )}

                  {/* TEXTUAL */}
                  {q.question_type === "textual" && (
                    <div>
                      {(q.textual_policy?.max_len || 500) > 120 ? (
                        <textarea
                          rows={3}
                          disabled={!form.is_active || isSubmitting}
                          value={currentAns[0] || ""}
                          onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                          maxLength={q.textual_policy?.max_len || 500}
                          placeholder="Your answer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 focus:border-purple-500 focus:outline-none text-base sm:text-sm text-slate-100 placeholder:text-slate-500 resize-none disabled:opacity-50"
                        />
                      ) : (
                        <input
                          type="text"
                          disabled={!form.is_active || isSubmitting}
                          value={currentAns[0] || ""}
                          onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                          maxLength={q.textual_policy?.max_len || 500}
                          placeholder="Your answer"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-purple-900/50 focus:border-purple-500 focus:outline-none text-base sm:text-sm text-slate-100 placeholder:text-slate-500 disabled:opacity-50"
                        />
                      )}
                    </div>
                  )}

                  {/* MULTIPLE CHOICE */}
                  {q.question_type === "multiple_choice" && (
                    <div className="space-y-2 pt-1">
                      {(q.multiple_choice_policy?.options || []).map((opt, oIdx) => {
                        const isSingle = q.multiple_choice_policy?.type === "Single";
                        const isSelected = isSingle
                          ? currentAns[0] === opt
                          : currentAns.includes(opt);

                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all cursor-pointer select-none ${
                              isSelected
                                ? "bg-purple-900/30 border-purple-500/70 text-white"
                                : "bg-black/30 border-purple-900/40 text-slate-300 hover:border-purple-800/60"
                            }`}
                          >
                            <input
                              type={isSingle ? "radio" : "checkbox"}
                              disabled={!form.is_active || isSubmitting}
                              name={`mc_${q.question_serial}`}
                              checked={isSelected}
                              onChange={() =>
                                isSingle
                                  ? handleSingleChoice(q.question_serial, opt)
                                  : handleMultipleChoiceToggle(q.question_serial, opt)
                              }
                              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-black/50 border-purple-700 cursor-pointer"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}

                  {/* FILE UPLOAD */}
                  {q.question_type === "file" && (
                    <div className="space-y-2">
                      {currentAns[0] ? (
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{currentAns[0]}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <label className="text-purple-300 hover:text-white font-medium cursor-pointer hover:underline">
                              <span>Replace</span>
                              <input
                                type="file"
                                disabled={!form.is_active || uploadingFiles[serialKey]}
                                onChange={(e) => handleFileUpload(q.question_serial, e.target.files?.[0], q.file_policy)}
                                className="hidden"
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => handleTextChange(q.question_serial, "")}
                              className="text-red-400 hover:text-red-300 font-medium hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="p-5 border border-dashed border-purple-900/60 hover:border-purple-500/60 bg-black/30 hover:bg-purple-950/20 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                          {uploadingFiles[serialKey] ? (
                            <div className="flex items-center gap-2 text-purple-300 py-2">
                              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                              <span className="text-xs font-mono">Uploading file...</span>
                            </div>
                          ) : (
                            <>
                              <UploadCloud className="w-6 h-6 mb-1 text-purple-400" />
                              <span className="text-xs font-medium text-slate-200">
                                Click to upload file
                              </span>
                              <span className="text-[10px] text-slate-400 mt-0.5">
                                {(q.file_policy?.supported_types || []).join(", ") || "pdf, doc, png, jpg"} (Max {q.file_policy?.max_size_mb || 5}MB)
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            disabled={!form.is_active || uploadingFiles[serialKey]}
                            onChange={(e) => handleFileUpload(q.question_serial, e.target.files?.[0], q.file_policy)}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  )}

                  {/* PAYMENT ACCEPTANCE */}
                  {q.question_type === "payment_acceptance" && (
                    <div className="space-y-3 pt-1">
                      {/* Amount Due */}
                      <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-900/40 flex items-center justify-between">
                        <span className="text-xs font-mono text-purple-300">Amount Due:</span>
                        <span className="text-xl font-mono font-bold text-emerald-400">
                          ₹{q.payment_policy?.amount || 0}
                        </span>
                      </div>

                      {/* QR Codes */}
                      <div className={`grid gap-4 ${q.payment_policy?.fallback_qr_url ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 max-w-xs mx-auto"}`}>
                        {q.payment_policy?.primary_qr_url && (
                          <div className="p-3 rounded-2xl bg-black/50 border border-purple-900/40 flex flex-col items-center text-center">
                            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                              <img
                                src={q.payment_policy.primary_qr_url}
                                alt="Primary QR"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-[11px] font-mono text-purple-300 mt-2">Primary QR</p>
                            <a
                              href={q.payment_policy.primary_qr_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-purple-300 hover:underline mt-0.5"
                            >
                              <span>View Full Size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}

                        {q.payment_policy?.fallback_qr_url && (
                          <div className="p-3 rounded-2xl bg-black/50 border border-purple-900/40 flex flex-col items-center text-center">
                            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-xl bg-white p-1.5 flex items-center justify-center shadow-md">
                              <img
                                src={q.payment_policy.fallback_qr_url}
                                alt="Fallback QR"
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <p className="text-[11px] font-mono text-amber-300 mt-2">Fallback QR</p>
                            <a
                              href={q.payment_policy.fallback_qr_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-amber-300 hover:underline mt-0.5"
                            >
                              <span>View Full Size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Screenshot upload */}
                      <div className="space-y-1.5 pt-1">
                        <label className="block text-xs font-medium text-slate-300">
                          Payment Screenshot {q.is_required && <span className="text-red-400">*</span>}
                        </label>
                        {currentAns[0] ? (
                          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                            <div className="flex items-center gap-2 truncate pr-2">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="truncate">{currentAns[0]}</span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <label className="text-purple-300 hover:text-white font-medium cursor-pointer hover:underline">
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  disabled={!form.is_active || uploadingFiles[serialKey]}
                                  onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                                  className="hidden"
                                />
                              </label>
                              <button
                                type="button"
                                onClick={() => handleTextChange(q.question_serial, "")}
                                className="text-red-400 hover:text-red-300 font-medium hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <label className="p-4 border border-dashed border-purple-900/60 hover:border-purple-500/60 bg-black/30 hover:bg-purple-950/20 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                            {uploadingFiles[serialKey] ? (
                              <div className="flex items-center gap-2 text-purple-300 py-1">
                                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                                <span className="text-xs font-mono">Uploading screenshot...</span>
                              </div>
                            ) : (
                              <>
                                <UploadCloud className="w-5 h-5 mb-1 text-purple-400" />
                                <span className="text-xs font-medium text-slate-200">
                                  Click to upload payment screenshot
                                </span>
                              </>
                            )}
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              disabled={!form.is_active || uploadingFiles[serialKey]}
                              onChange={(e) => handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  )}

                  {/* PAYMENT CHECKOUT */}
                  {q.question_type?.toLowerCase() === "payment_checkout" && (
                    <div className="space-y-4 pt-1">
                      {/* Cart Items Selector */}
                      <div className="p-4 rounded-2xl bg-black/40 border border-purple-900/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-300">
                              Select Item(s)
                            </span>
                          </div>

                          {((q.payment_checkout_policy?.items || []).length > 1) && (
                            <div className="flex items-center gap-2 text-[11px] font-mono">
                              <button
                                type="button"
                                disabled={!form.is_active}
                                onClick={() =>
                                  handleSelectAllCheckoutItems(
                                    q.question_serial,
                                    (q.payment_checkout_policy?.items || []).length
                                  )
                                }
                                className="text-purple-400 hover:text-purple-300 hover:underline cursor-pointer disabled:opacity-50"
                              >
                                Select All
                              </button>
                              <span className="text-purple-800">|</span>
                              <button
                                type="button"
                                disabled={!form.is_active}
                                onClick={() => handleClearCheckoutItems(q.question_serial)}
                                className="text-slate-400 hover:text-slate-300 hover:underline cursor-pointer disabled:opacity-50"
                              >
                                Clear
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Items List */}
                        <div className="space-y-2">
                          {(q.payment_checkout_policy?.items || []).map((item, itemIdx) => {
                            const isSelected = (checkoutSelections[serialKey] || []).includes(itemIdx);
                            return (
                              <div
                                key={itemIdx}
                                onClick={() => {
                                  if (form.is_active) {
                                    handleToggleCheckoutItem(q.question_serial, itemIdx);
                                  }
                                }}
                                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all cursor-pointer select-none ${
                                  isSelected
                                    ? "bg-purple-900/40 border-purple-500/70 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                                    : "bg-black/30 border-purple-900/30 text-slate-300 hover:border-purple-800/60 hover:bg-purple-950/20"
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? "bg-purple-600 border-purple-400 text-white"
                                        : "border-purple-800 bg-black/40"
                                    }`}
                                  >
                                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="font-semibold">{item.title}</span>
                                </div>

                                <div className="flex items-center font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-purple-950/60 border border-purple-700/40 text-purple-200">
                                  ₹{item.cost.toLocaleString("en-IN")}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Total Due Row */}
                        {(() => {
                          const items = q.payment_checkout_policy?.items || [];
                          const selected = checkoutSelections[serialKey] || [];
                          const totalDue = selected.reduce((sum, idx) => sum + (items[idx]?.cost || 0), 0);

                          return (
                            <div className="mt-3 pt-3 border-t border-purple-900/40 flex items-center justify-between">
                              <div className="text-[11px] font-mono text-purple-300/80">
                                <span>Selected: </span>
                                <span className="font-bold text-white">{selected.length}</span>
                                <span> of {items.length} item(s)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono uppercase text-slate-300">Total Due:</span>
                                <span className="text-sm sm:text-base font-extrabold font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                  ₹{totalDue.toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* UPI QR Code Container */}
                      {(() => {
                        const items = q.payment_checkout_policy?.items || [];
                        const selected = checkoutSelections[serialKey] || [];
                        const totalDue = selected.reduce((sum, idx) => sum + (items[idx]?.cost || 0), 0);
                        const qrMode = activeQrSource[serialKey] || "primary";
                        const qrUrl =
                          qrMode === "fallback" && q.payment_checkout_policy?.fallback_qr_url
                            ? q.payment_checkout_policy.fallback_qr_url
                            : q.payment_checkout_policy?.primary_qr_url;

                        return (
                          <div className="p-4 rounded-2xl bg-purple-950/25 border border-purple-800/40 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-purple-400 shrink-0" />
                                <div>
                                  <h4 className="text-xs font-bold font-mono uppercase text-purple-200">
                                    Scan & Pay via UPI
                                  </h4>
                                  <p className="text-[11px] text-slate-400">
                                    Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI app
                                  </p>
                                </div>
                              </div>

                              {q.payment_checkout_policy?.fallback_qr_url && (
                                <button
                                  type="button"
                                  onClick={() => toggleQrSource(q.question_serial)}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-900/70 border border-purple-600/40 text-[10px] font-mono text-purple-200 transition-all cursor-pointer self-start sm:self-auto"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                  <span>
                                    {qrMode === "primary" ? "Switch to Backup QR" : "Switch to Primary QR"}
                                  </span>
                                </button>
                              )}
                            </div>

                            {qrUrl ? (
                              <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-black/40 border border-purple-900/40 space-y-3">
                                <div className="p-3 bg-white rounded-2xl shadow-xl border-2 border-purple-400/50 transition-transform hover:scale-[1.02]">
                                  <img
                                    src={qrUrl}
                                    alt="UPI Payment QR Code"
                                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain"
                                  />
                                </div>

                                <div className="text-center space-y-1">
                                  <div className="text-xs font-mono font-bold text-purple-200">
                                    Amount to Pay:{" "}
                                    <span className="text-emerald-400">
                                      ₹{totalDue.toLocaleString("en-IN")}
                                    </span>
                                  </div>
                                  <a
                                    href={qrUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-purple-300 hover:text-white underline font-mono cursor-pointer"
                                  >
                                    <span>Open QR code image in new tab</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-black/30 border border-purple-900/30 text-center text-xs font-mono text-purple-300/70">
                                QR Code image not available for this checkout.
                              </div>
                            )}

                            {/* Payment Proof Upload */}
                            <div className="space-y-2 pt-2 border-t border-purple-900/30">
                              <div className="flex items-center justify-between">
                                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                                  <Receipt className="w-3.5 h-3.5 text-purple-400" />
                                  <span>Upload Payment Confirmation Screenshot</span>
                                  {q.is_required && <span className="text-red-400 font-bold ml-1">*</span>}
                                </label>
                                <span className="text-[10px] font-mono text-slate-400">
                                  Max 10MB
                                </span>
                              </div>

                              {answersMap[serialKey]?.[0] ? (
                                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                                  <div className="flex items-center gap-2 truncate pr-2">
                                    <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                    <span className="truncate">{answersMap[serialKey][0]}</span>
                                  </div>
                                  <div className="flex items-center gap-3 shrink-0">
                                    <a
                                      href={answersMap[serialKey][0]}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] text-emerald-300 hover:text-white font-bold hover:underline cursor-pointer"
                                    >
                                      View
                                    </a>
                                    <label className="text-[11px] text-purple-300 hover:text-white font-bold cursor-pointer hover:underline">
                                      <span>Replace</span>
                                      <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        disabled={!form.is_active || uploadingFiles[serialKey]}
                                        onChange={(e) =>
                                          handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])
                                        }
                                        className="hidden"
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => handleTextChange(q.question_serial, "")}
                                      className="text-[11px] text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <label className="p-4 sm:p-5 border-2 border-dashed border-purple-900/60 hover:border-purple-500/60 bg-black/40 hover:bg-purple-950/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                                  {uploadingFiles[serialKey] ? (
                                    <div className="flex items-center gap-2 text-purple-300 py-1">
                                      <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                      <span className="text-xs font-mono font-semibold">
                                        Uploading payment proof...
                                      </span>
                                    </div>
                                  ) : (
                                    <>
                                      <UploadCloud className="w-7 h-7 mb-1.5 text-purple-400" />
                                      <span className="text-xs font-semibold text-slate-200">
                                        Click to upload payment screenshot
                                      </span>
                                      <span className="text-[10px] font-mono text-purple-300/70 mt-1">
                                        PNG, JPG, WEBP, PDF (Max 10MB)
                                      </span>
                                    </>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/*,application/pdf"
                                    disabled={!form.is_active || uploadingFiles[serialKey]}
                                    onChange={(e) =>
                                      handlePaymentScreenshotUpload(q.question_serial, e.target.files?.[0])
                                    }
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>
              );
            })}

          {/* SUBMIT BUTTON */}
          <div className="pt-6 border-t border-purple-900/40 flex justify-end">
            <button
              type="submit"
              disabled={
                !form.is_active ||
                isSubmitting ||
                emailCheckStatus === "exists" ||
                Object.values(uploadingFiles).some(Boolean)
              }
              className="w-full sm:w-auto min-h-[44px] px-8 py-2.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
