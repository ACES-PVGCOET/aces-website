"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import NeuralNetworkBackground from "@/components/NeuralNetworkBackground";
import FormModal from "@/components/FormModal";
import { getAllForms } from "@/lib/api/formsApi";
import { FormListItem } from "@/lib/types/forms";
import { Loader2, FileText, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

export default function FormsPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getAllForms()
      .then((data) => {
        setForms(data);
      })
      .catch((err) => {
        console.error("Failed to load forms list:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-slate-100 font-sans overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <NeuralNetworkBackground />

      <Navbar />

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-32 pb-20">
        <div className="text-center space-y-3 mb-12">
          <span className="px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold tracking-widest uppercase">
            ACES FORMS ENGINE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Active Forms & Registrations
          </h1>
          <p className="text-sm text-slate-400 max-w-xl mx-auto font-light">
            Browse active event registration forms, feedback surveys, and member applications.
          </p>
        </div>

        {loading ? (
          <div className="p-16 rounded-3xl bg-purple-950/20 border border-purple-900/30 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
            <p className="text-sm font-mono text-purple-300">Loading Available Forms...</p>
          </div>
        ) : forms.length === 0 ? (
          <div className="p-12 rounded-3xl bg-purple-950/20 border border-purple-900/30 text-center space-y-3">
            <FileText className="w-12 h-12 text-purple-400 opacity-60 mx-auto" />
            <h2 className="text-lg font-bold text-white">No Forms Found</h2>
            <p className="text-xs text-slate-400">Check back soon for new registration forms and surveys.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((item) => (
              <div
                key={item.form_id}
                className="p-6 rounded-3xl bg-[#0c0418] border border-purple-900/40 hover:border-purple-500/50 transition-all shadow-lg flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold">
                      <FileText className="w-5 h-5" />
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        item.is_active
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {item.is_active ? "Active" : "Closed"}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 font-light">
                    {item.description || "No description provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-purple-900/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300/80">{item.question_count} Questions</span>
                  <button
                    onClick={() => setSelectedFormId(item.form_id)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider uppercase text-[11px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
                  >
                    <span>Fill Form</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Form Modal */}
        <FormModal
          formId={selectedFormId}
          isOpen={Boolean(selectedFormId)}
          onClose={() => setSelectedFormId(null)}
        />
      </main>

      <Sidebar />
      <Footer />
    </div>
  );
}
