"use client";

import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import { FormDetail } from "@/lib/types/forms";
import { getFormById } from "@/lib/api/formsApi";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { X, Loader2, AlertCircle, RefreshCw } from "lucide-react";
=======
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
  Check,
  ShoppingCart,
  QrCode,
  CreditCard,
  ExternalLink,
  RotateCcw,
  Receipt,
} from "lucide-react";
>>>>>>> 7bd5c5d (feat: add payment checkout and acceptance components to FormModal)

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

<<<<<<< HEAD
=======
  const [fillerEmail, setFillerEmail] = useState<string>("");
  const [emailCheckStatus, setEmailCheckStatus] = useState<"checking" | "exists" | "available" | null>(null);
  const [answersMap, setAnswersMap] = useState<Record<string, string[]>>({});
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});

  // Payment checkout & acceptance state
  const [checkoutSelections, setCheckoutSelections] = useState<Record<string, number[]>>({});
  const [activeQrSource, setActiveQrSource] = useState<Record<string, "primary" | "fallback">>({});

  // Fetch form details if formId is provided and form is missing
>>>>>>> 7bd5c5d (feat: add payment checkout and acceptance components to FormModal)
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
<<<<<<< HEAD
=======

    setFillerEmail("");
    setEmailCheckStatus(null);
    setErrorMsg("");
    setIsSubmitting(false);
    setIsSubmittedSuccess(false);
    setUploadingFiles({});
    setCheckoutSelections({});
    setActiveQrSource({});
>>>>>>> 7bd5c5d (feat: add payment checkout and acceptance components to FormModal)
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

<<<<<<< HEAD
=======
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

  // Input change handlers
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
    const current = prevAnswers(key);
    const exists = current.includes(option);
    const updated = exists ? current.filter((item) => item !== option) : [...current, option];
    setAnswersMap((prev) => ({
      ...prev,
      [key]: updated,
    }));
  };

  const prevAnswers = (key: string): string[] => answersMap[key] || [];

  // File Upload Handler for Form Questions
  const handleFileUpload = async (serial: number, file?: File, filePolicy?: FilePolicy) => {
    if (!file) return;

    // Validate File Size
    const maxMb = filePolicy?.max_size_mb || 5;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`File "${file.name}" exceeds maximum allowed limit of ${maxMb}MB.`);
      return;
    }

    // Validate File Extension
    const supportedTypes = (filePolicy?.supported_types || []).map((t) => t.toLowerCase().replace(/^\./, ''));
    if (supportedTypes.length > 0) {
      const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || '' : '';
      if (!supportedTypes.includes(ext)) {
        setErrorMsg(`File extension .${ext} is not allowed. Supported type(s): [${supportedTypes.join(', ')}]`);
        return;
      }
    }

    const serialKey = String(serial);
    try {
      setErrorMsg('');
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: true }));
      const uploadRes = await uploadFormFile(file);

      setAnswersMap((prev) => ({
        ...prev,
        [serialKey]: [uploadRes.url],
      }));
    } catch (err: any) {
      console.error('[FormModal] File upload error:', err);
      setErrorMsg(err.message || 'File upload failed. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: false }));
    }
  };

  // Payment Checkout Item Selection Handlers
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

  // Payment Proof Upload Handler (image or PDF up to 10MB)
  const handlePaymentProofUpload = async (serial: number, file?: File) => {
    if (!file) return;

    // Validate File Size (max 10MB per Forms API specs)
    const maxMb = 10;
    if (file.size > maxMb * 1024 * 1024) {
      setErrorMsg(`Payment screenshot "${file.name}" exceeds maximum allowed limit of ${maxMb}MB.`);
      return;
    }

    // Validate File Extension (images or PDF)
    const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() || '' : '';
    const allowedTypes = ['png', 'jpg', 'jpeg', 'webp', 'pdf'];
    if (!allowedTypes.includes(ext)) {
      setErrorMsg(`File extension .${ext} is not supported. Please upload an image (PNG, JPG, WEBP) or PDF screenshot.`);
      return;
    }

    const serialKey = String(serial);
    try {
      setErrorMsg('');
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: true }));
      const uploadRes = await uploadFormFile(file);

      setAnswersMap((prev) => ({
        ...prev,
        [serialKey]: [uploadRes.url],
      }));
    } catch (err: any) {
      console.error('[FormModal] Payment proof upload error:', err);
      setErrorMsg(err.message || 'Payment screenshot upload failed. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [serialKey]: false }));
    }
  };

  // Form submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form) return;

    const trimmedEmail = fillerEmail.trim();
    if (!trimmedEmail) {
      setErrorMsg("Email address is required to submit your response.");
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
      setErrorMsg("Please wait for file upload to complete before submitting.");
      return;
    }

    // Validate mandatory questions
    for (const q of form.questions || []) {
      const serialKey = String(q.question_serial);
      const answerArr = answersMap[serialKey] || [];
      const qType = (q.question_type || "").toLowerCase();

      if (qType === "payment_checkout") {
        const selected = checkoutSelections[serialKey] || [];
        if (q.is_required && selected.length === 0) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Please select at least one item.`);
          return;
        }
        if (q.is_required && (!answerArr || answerArr.length === 0 || !answerArr[0])) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Please upload your payment confirmation screenshot.`);
          return;
        }
        if (selected.length > 0 && (!answerArr || answerArr.length === 0 || !answerArr[0])) {
          setErrorMsg(`Question #${q.question_serial}: You have selected item(s). Please upload your payment confirmation screenshot before submitting.`);
          return;
        }
      } else if (qType === "payment_acceptance") {
        if (q.is_required && (!answerArr || answerArr.length === 0 || !answerArr[0])) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}"): Payment confirmation screenshot is required.`);
          return;
        }
      } else {
        if (q.is_required && answerArr.length === 0) {
          setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}") is required.`);
          return;
        }
      }
    }

    try {
      setIsSubmitting(true);
      await submitFormResponse(form.form_id, {
        email: trimmedEmail,
        answers: answersMap,
      });
      setIsSubmittedSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

>>>>>>> 7bd5c5d (feat: add payment checkout and acceptance components to FormModal)
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
<<<<<<< HEAD
          <DynamicFormRenderer form={form} mode="modal" onClose={onClose} />
=======
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
                onBlur={(e) => handleEmailBlur(e.target.value)}
                placeholder="Enter your email (e.g. participant@example.com)"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-black/40 border text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
                  emailCheckStatus === "exists"
                    ? "border-red-500 text-red-300 bg-red-500/10"
                    : emailCheckStatus === "available"
                    ? "border-emerald-500/60 text-emerald-300 bg-emerald-500/5"
                    : "border-purple-900/60 focus:border-purple-500"
                }`}
              />

              {emailCheckStatus === "checking" && (
                <p className="text-[10px] font-mono text-purple-300">Checking response record...</p>
              )}
              {emailCheckStatus === "exists" && (
                <p className="text-[10px] text-red-400 font-mono flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>A response has already been submitted with this email address.</span>
                </p>
              )}
              {emailCheckStatus === "available" && (
                <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Email verified. Ready for submission.</span>
                </p>
              )}
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {(form.questions || [])
                .sort((a, b) => (a.question_serial || 0) - (b.question_serial || 0))
                .map((q) => {
                  const serialKey = String(q.question_serial);
                  const currentAns = prevAnswers(serialKey);

                                   return (
                    <div
                      key={q.question_serial}
                      className="p-5 rounded-2xl bg-slate-950/60 border border-purple-900/30 space-y-3 hover:border-purple-800/50 transition-colors"
                    >
                      {/* Question Header */}
                      <label className="block text-xs sm:text-sm font-semibold leading-relaxed text-slate-200">
                        <span className="text-purple-400 font-mono font-bold mr-1">
                          Q{q.question_serial}.
                        </span>
                        <span>{q.question_statement}</span>
                        {q.is_required && <span className="text-red-400 font-bold ml-1">*</span>}
                      </label>

                      {/* Question Body Image (rendered if image_url is present) */}
                      {q.image_url && (
                        <div className="my-3 rounded-xl overflow-hidden border border-purple-900/50 bg-black/50 p-2 flex items-center justify-center">
                          <img
                            src={q.image_url}
                            alt={`Illustration for question ${q.question_serial}`}
                            className="max-h-60 w-auto object-contain rounded-lg shadow-lg"
                          />
                        </div>
                      )}
                      {/* TEXTUAL INPUT */}
                      {q.question_type === "textual" && (
                        <div>
                          {(q.textual_policy?.max_len || 500) > 120 ? (
                            <textarea
                              rows={3}
                              disabled={!form.is_active}
                              value={currentAns[0] || ""}
                              onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                              maxLength={q.textual_policy?.max_len || 500}
                              placeholder="Type your response here..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-900/60 focus:border-purple-500 focus:outline-none text-xs font-light text-slate-100 placeholder:text-slate-500 resize-none disabled:opacity-50"
                            />
                          ) : (
                            <input
                              type="text"
                              disabled={!form.is_active}
                              value={currentAns[0] || ""}
                              onChange={(e) => handleTextChange(q.question_serial, e.target.value)}
                              maxLength={q.textual_policy?.max_len || 500}
                              placeholder="Type your answer..."
                              className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-purple-900/60 focus:border-purple-500 focus:outline-none text-xs font-light text-slate-100 placeholder:text-slate-500 disabled:opacity-50"
                            />
                          )}
                          <div className="flex justify-end text-[10px] font-mono text-slate-500 mt-1">
                            {(currentAns[0] || "").length} / {q.textual_policy?.max_len || 500} chars
                          </div>
                        </div>
                      )}

                      {/* MULTIPLE CHOICE INPUT */}
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
                                className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                                  isSelected
                                    ? "bg-purple-900/40 border-purple-500/60 text-white shadow-[0_0_15px_rgba(168,85,247,0.2)] font-semibold"
                                    : "bg-black/30 border-purple-900/30 text-slate-300 hover:border-purple-800/60 hover:bg-purple-950/20"
                                }`}
                              >
                                <input
                                  type={isSingle ? "radio" : "checkbox"}
                                  disabled={!form.is_active}
                                  name={`mc_web_${q.question_serial}`}
                                  checked={isSelected}
                                  onChange={() =>
                                    isSingle
                                      ? handleSingleChoice(q.question_serial, opt)
                                      : handleMultipleChoiceToggle(q.question_serial, opt)
                                  }
                                  className="rounded text-purple-600 focus:ring-purple-500 bg-black/40 border-purple-700"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* FILE QUESTION INPUT WITH UPLOAD */}
                      {q.question_type === "file" && (
                        <div className="space-y-2">
                          {currentAns[0] ? (
                            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                              <div className="flex items-center gap-2 truncate pr-2">
                                <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span className="truncate">{currentAns[0]}</span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <label className="text-[11px] text-purple-300 hover:text-white font-bold cursor-pointer hover:underline">
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
                                  className="text-[11px] text-red-400 hover:text-red-300 font-bold hover:underline cursor-pointer"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="p-5 border-2 border-dashed border-purple-900/60 hover:border-purple-500/60 bg-black/40 hover:bg-purple-950/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all">
                              {uploadingFiles[serialKey] ? (
                                <div className="flex items-center gap-2 text-purple-300 py-1">
                                  <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
                                  <span className="text-xs font-mono font-semibold">Uploading file to server...</span>
                                </div>
                              ) : (
                                <>
                                  <UploadCloud className="w-7 h-7 mb-1.5 text-purple-400" />
                                  <span className="text-xs font-semibold text-slate-200">
                                    Click or select file to upload
                                  </span>
                                  <span className="text-[10px] font-mono text-purple-300/70 mt-1">
                                    Supported types: {(q.file_policy?.supported_types || []).join(", ") || "pdf, doc, png, jpg"} (Max {q.file_policy?.max_size_mb || 5}MB)
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

                      {/* PAYMENT CHECKOUT INPUT */}
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

                                  {currentAns[0] ? (
                                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                                      <div className="flex items-center gap-2 truncate pr-2">
                                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="truncate">{currentAns[0]}</span>
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                        <a
                                          href={currentAns[0]}
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
                                              handlePaymentProofUpload(q.question_serial, e.target.files?.[0])
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
                                            Uploading payment proof to secure Cloudinary...
                                          </span>
                                        </div>
                                      ) : (
                                        <>
                                          <UploadCloud className="w-7 h-7 mb-1.5 text-purple-400" />
                                          <span className="text-xs font-semibold text-slate-200">
                                            Click or select payment screenshot / receipt
                                          </span>
                                          <span className="text-[10px] font-mono text-purple-300/70 mt-1">
                                            Attach screenshot showing Transaction ID / UTR (PNG, JPG, PDF - Max 10MB)
                                          </span>
                                        </>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        disabled={!form.is_active || uploadingFiles[serialKey]}
                                        onChange={(e) =>
                                          handlePaymentProofUpload(q.question_serial, e.target.files?.[0])
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

                      {/* PAYMENT ACCEPTANCE (FIXED SINGLE AMOUNT) */}
                      {q.question_type?.toLowerCase() === "payment_acceptance" && (
                        <div className="space-y-4 pt-1">
                          {(() => {
                            const amount = q.payment_policy?.amount || 0;
                            const qrMode = activeQrSource[serialKey] || "primary";
                            const qrUrl =
                              qrMode === "fallback" && q.payment_policy?.fallback_qr_url
                                ? q.payment_policy.fallback_qr_url
                                : q.payment_policy?.primary_qr_url;

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
                                        Fixed registration fee: ₹{amount.toLocaleString("en-IN")}
                                      </p>
                                    </div>
                                  </div>

                                  {q.payment_policy?.fallback_qr_url && (
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
                                        Payable Fee:{" "}
                                        <span className="text-emerald-400">
                                          ₹{amount.toLocaleString("en-IN")}
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
                                    QR Code image not available.
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

                                  {currentAns[0] ? (
                                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-mono text-emerald-300">
                                      <div className="flex items-center gap-2 truncate pr-2">
                                        <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                                        <span className="truncate">{currentAns[0]}</span>
                                      </div>
                                      <div className="flex items-center gap-3 shrink-0">
                                        <a
                                          href={currentAns[0]}
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
                                              handlePaymentProofUpload(q.question_serial, e.target.files?.[0])
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
                                            Uploading payment proof to secure Cloudinary...
                                          </span>
                                        </div>
                                      ) : (
                                        <>
                                          <UploadCloud className="w-7 h-7 mb-1.5 text-purple-400" />
                                          <span className="text-xs font-semibold text-slate-200">
                                            Click or select payment screenshot / receipt
                                          </span>
                                          <span className="text-[10px] font-mono text-purple-300/70 mt-1">
                                            Attach screenshot showing Transaction ID / UTR (PNG, JPG, PDF - Max 10MB)
                                          </span>
                                        </>
                                      )}
                                      <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        disabled={!form.is_active || uploadingFiles[serialKey]}
                                        onChange={(e) =>
                                          handlePaymentProofUpload(q.question_serial, e.target.files?.[0])
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
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-4 border-t border-purple-900/40 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-700 hover:border-purple-500/40 bg-slate-900/60 text-slate-300 hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!form.is_active || isSubmitting || emailCheckStatus === "exists" || Object.values(uploadingFiles).some(Boolean)}
                className="px-6 py-2.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-wider uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Response</span>
                  </>
                )}
              </button>
            </div>

          </form>
>>>>>>> 7bd5c5d (feat: add payment checkout and acceptance components to FormModal)
        ) : null}
      </div>
    </div>
  );
}
