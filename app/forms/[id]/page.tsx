"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import FormModal from "@/components/FormModal";
import { getFormById } from "@/lib/api/formsApi";
import { FormDetail } from "@/lib/types/forms";
import { Loader2, AlertCircle, ArrowLeft, FileText } from "lucide-react";

export default function SingleFormPage() {
  const params = useParams();
  const router = useRouter();
  const formId = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [form, setForm] = useState<FormDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);

  useEffect(() => {
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
  }, [formId]);

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <NeuralNetworkBackground />

      <Navbar />

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-mono text-purple-300 hover:text-white mb-6 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-900/40 hover:bg-purple-900/60 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {loading ? (
          <div className="p-16 rounded-3xl bg-purple-950/20 border border-purple-900/30 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <p className="text-sm font-mono text-purple-300">Loading Dynamic Form Spec...</p>
          </div>
        ) : error ? (
          <div className="p-12 rounded-3xl bg-red-950/20 border border-red-900/40 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
            <h2 className="text-xl font-bold text-red-300">Form Not Available</h2>
            <p className="text-xs text-slate-300 max-w-md mx-auto">{error}</p>
          </div>
        ) : form ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-[#0c0418] border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.25)] space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{form.title}</h1>
                <p className="text-xs font-mono text-purple-300/80">Form ID: {form.form_id}</p>
              </div>
            </div>

            {form.description && (
              <p className="text-sm text-slate-300 leading-relaxed font-light border-b border-purple-900/40 pb-6">
                {form.description}
              </p>
            )}

            <div className="pt-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-3.5 rounded-xl border border-purple-500/50 bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs tracking-wider uppercase shadow-[0_0_25px_rgba(168,85,247,0.6)] transition-all cursor-pointer"
              >
                Open Form Engine Modal
              </button>
            </div>
          </div>
        ) : null}

        {/* Embedded Form Modal */}
        {form && (
          <FormModal
            initialForm={form}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </main>

      <Sidebar />
      <Footer />
    </div>
  );
}
