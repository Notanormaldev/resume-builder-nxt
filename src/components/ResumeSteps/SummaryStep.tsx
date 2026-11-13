"use client";

import React, { useState } from "react";
import { SparklesIcon, Spinner } from "../Icons";

interface SummaryStepProps {
  summary: string;
  onChange: (val: string) => void;
  defaultRole?: string;
  skillsList?: string[];
}

export default function SummaryStep({
  summary,
  onChange,
  defaultRole = "",
  skillsList = [],
}: SummaryStepProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [jobTitle, setJobTitle] = useState(defaultRole || "Software Engineer");
  const [experienceLevel, setExperienceLevel] = useState("Mid-level (3-5 years)");
  const [customSkills, setCustomSkills] = useState(skillsList.slice(0, 6).join(", ") || "React, TypeScript, Node.js");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [aiError, setAiError] = useState("");

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    setAiError("");
    try {
      const res = await fetch("/api/ai/gen-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          experiencelevel: experienceLevel,
          skills: customSkills,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.summary) {
        onChange(data.data.summary.trim());
        setShowAiModal(false);
      } else {
        setAiError(data.message || "Failed to generate summary");
      }
    } catch {
      setAiError("Network error while generating summary");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImproveSummary = async () => {
    if (!summary || summary.trim().length < 10) {
      alert("Please enter a few sentences first to improve.");
      return;
    }
    setIsImproving(true);
    try {
      const res = await fetch("/api/ai/improve-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: summary }),
      });
      const data = await res.json();
      if (data.success && data.data?.newcontent) {
        onChange(data.data.newcontent.trim());
      } else {
        alert(data.message || "Failed to polish summary");
      }
    } catch {
      alert("Error polishing summary");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Professional Summary</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Step 2 of 7
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Write a 2-4 sentence hook summarizing your career wins, technical scope, and core value proposition.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiModal(!showAiModal)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs hover:from-indigo-600 hover:to-violet-700 transition"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Generate with AI</span>
            </button>

            {summary && summary.length > 20 && (
              <button
                type="button"
                disabled={isImproving}
                onClick={handleImproveSummary}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition disabled:opacity-50"
              >
                {isImproving ? <Spinner className="w-3.5 h-3.5 text-slate-600" /> : <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />}
                <span>{isImproving ? "Polishing..." : "Polish ATS"}</span>
              </button>
            )}
          </div>
        </div>

        {/* AI Helper Accordion */}
        {showAiModal && (
          <div className="mt-4 p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                AI Summary Generator
              </span>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-xs text-indigo-700 hover:text-indigo-900 font-medium"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Entry level (0-2 years)">Entry level (0-2 years)</option>
                  <option value="Mid-level (3-5 years)">Mid-level (3-5 years)</option>
                  <option value="Senior (6+ years)">Senior (6+ years)</option>
                  <option value="Lead / Staff Principal">Lead / Staff Principal</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-medium text-slate-700 mb-1">Core Keywords / Skills</label>
                <input
                  type="text"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  placeholder="e.g. Next.js, TypeScript, PostgreSQL, AWS"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            {aiError && <p className="text-xs text-rose-600">{aiError}</p>}

            <div className="flex justify-end pt-1">
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50"
              >
                {isGenerating ? <Spinner className="w-3.5 h-3.5 text-white" /> : <SparklesIcon className="w-3.5 h-3.5" />}
                <span>{isGenerating ? "Crafting Summary..." : "Apply AI Summary"}</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-5">
          <textarea
            rows={5}
            value={summary || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Seasoned software engineer with 5+ years of experience delivering robust web platforms..."
            className="w-full text-sm p-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition leading-relaxed bg-slate-50/40 hover:bg-white"
          />
          <div className="flex justify-between items-center text-xs text-slate-400 mt-1.5">
            <span>Ideal length: 50–80 words (ATS sweet-spot)</span>
            <span>{summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
          </div>
        </div>
      </div>
    </div>
  );
}

