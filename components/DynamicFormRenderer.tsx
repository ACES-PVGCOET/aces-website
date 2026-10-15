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
      if (q.is_required && (answerArr.length === 0 || !answerArr[0]?.trim())) {
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
        <div className="rounded-2xl bg-[#0c0418] border border-purple-900/40 p-8 sm:p-12 text-center space-y-5 text-slate-100 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Response Submitted</h2>
            <p className="text-sm text-slate-300 font-light leading-relaxed">
              Your response for <span className="font-medium text-white">{form.title}</span> has been successfully recorded.
            </p>
          </div>

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
