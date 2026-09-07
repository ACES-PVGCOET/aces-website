"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import DynamicFormRenderer from "@/components/DynamicFormRenderer";
import { getFormById } from "@/lib/api/formsApi";
import { FormDetail } from "@/lib/types/forms";
import { Loader2, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

export default function SingleFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const fetchForm = () => {
    if (!formId) return;

    setLoading(true);
    setError("");
    getFormById(formId)
      .then((data) => {
        setForm(data);
      })
      .catch((err) => {
        console.error("Failed to load form:", err);
        setError(err.message || "Unable to fetch form details. Please check the URL or form ID.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchForm();
  }, [formId]);

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <NeuralNetworkBackground />

      <Navbar />

      <main className="relative z-10 w-full flex-1 pt-28 sm:pt-32 pb-20 px-4 sm:px-6">
        {/* Navigation */}
        <div className="max-w-2xl mx-auto mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-mono text-purple-300 hover:text-white px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-900/50 hover:bg-purple-900/60 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className="max-w-4xl mx-auto p-12 sm:p-20 rounded-3xl bg-[#0c0418]/80 border border-purple-900/30 backdrop-blur-xl flex flex-col items-center justify-center text-center space-y-4 shadow-2xl">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-ping" />
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-white">Loading Form Specification...</p>
              <p className="text-xs font-mono text-purple-300/80">Fetching verified dynamic form schema</p>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {!loading && error && (
          <div className="max-w-xl mx-auto p-8 sm:p-12 rounded-3xl bg-red-950/20 border border-red-900/40 backdrop-blur-xl text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-400 mx-auto flex items-center justify-center">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-red-300">Form Not Found or Unavailable</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">{error}</p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={fetchForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-900/40 border border-red-500/30 hover:bg-red-900/60 text-xs font-mono font-bold text-white transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
              <Link
                href="/forms"
                className="px-5 py-2.5 rounded-xl bg-purple-900/40 border border-purple-500/30 hover:bg-purple-900/60 text-xs font-mono font-bold text-white transition-all"
              >
                Browse All Forms
              </Link>
            </div>
          </div>
        )}

        {/* NATIVE FULL SCREEN FORM RENDERER */}
        {!loading && !error && form && (
          <DynamicFormRenderer form={form} mode="page" />
        )}
      </main>

      <Sidebar />
      <Footer />
    </div>
  );
}
