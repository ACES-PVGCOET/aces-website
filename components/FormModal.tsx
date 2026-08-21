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

  // Fetch form details if formId is provided and form is missing
  useEffect(() => {
    if (!isOpen) return;

    if (initialForm) {
      setForm(initialForm);
      initAnswersMap(initialForm.questions);
    } else if (formId) {
      setLoading(true);
      setFetchError("");
      getFormById(formId)
        .then((fetchedForm) => {
          setForm(fetchedForm);
          initAnswersMap(fetchedForm.questions);
        })
        .catch((err) => {
          console.error("Error loading form:", err);
          setFetchError(err.message || "Failed to load form details from server.");
        })
        .finally(() => setLoading(false));
    }

    setFillerEmail("");
    setEmailCheckStatus(null);
    setErrorMsg("");
    setIsSubmitting(false);
    setIsSubmittedSuccess(false);
    setUploadingFiles({});
  }, [formId, initialForm, isOpen]);

  const initAnswersMap = (questions: FormQuestion[]) => {
    if (!Array.isArray(questions)) return;
    const initial: Record<string, string[]> = {};
    questions.forEach((q) => {
      initial[String(q.question_serial)] = [];
    });
    setAnswersMap(initial);
  };

  if (!isOpen) return null;

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
      if (q.is_required && answerArr.length === 0) {
        setErrorMsg(`Question #${q.question_serial} ("${q.question_statement}") is required.`);
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
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Modal Card */}
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-[#0c0418] border border-purple-500/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(168,85,247,0.3)] flex flex-col text-slate-100">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-900/40 flex items-center justify-between bg-purple-950/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold shadow-inner">
              <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {form ? form.title : "ACES Dynamic Form"}
              </h2>
              <p className="text-xs text-purple-300/70 font-mono">
                Official ACES Registration & Response Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 border border-purple-500/30 text-slate-300 hover:text-white hover:bg-purple-900/50 transition-colors"
            aria-label="Close form modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Loading / Fetch Error State */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4 text-center">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            <p className="text-xs font-mono text-purple-300">Fetching Form Specification...</p>
          </div>
        ) : fetchError ? (
          <div className="p-8 text-center space-y-4">
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
          /* SUCCESS SUBMISSION STATE */
          <div className="p-8 sm:p-12 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center animate-bounce shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-emerald-300">
              Response Successfully Submitted!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for completing &quot;<span className="font-semibold text-white">{form?.title}</span>&quot;. Your entries have been securely registered under <span className="font-mono text-emerald-400">{fillerEmail}</span>.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all"
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
        ) : null}

      </div>
    </div>
  );
}
