"use client";

import React, { useState } from "react";
import { SparklesIcon, Spinner, CheckIcon } from "./Icons";
import { IResume } from "@/types/resume.type";

interface ATSModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: Partial<IResume>;
  onAddSkill: (skill: string) => void;
}

export default function ATSModal({
  isOpen,
  onClose,
  resumeData,
  onAddSkill,
}: ATSModalProps) {
  const [loading, setLoading] = useState(false);
  const [atsResult, setAtsResult] = useState<any>(null);
  const [addedKeywords, setAddedKeywords] = useState<{ [key: string]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Compile full resume text for ATS evaluation
  const compileResumeText = () => {
    const lines: string[] = [];
    if (resumeData.title) lines.push(`Title: ${resumeData.title}`);
    if (resumeData.PersonalInfo) {
      const p = resumeData.PersonalInfo;
      lines.push(`Name: ${p.fullname || ""}`);
      lines.push(`Contact: ${p.email || ""} ${p.mobile || ""} ${p.location || ""}`);
      lines.push(`Links: ${p.portfolio || ""} ${p.linkdin || ""} ${p.github || ""}`);
    }
    if (resumeData.summary) {
      lines.push(`\nSummary:\n${resumeData.summary}`);
    }
    if (resumeData.skills && resumeData.skills.length > 0) {
      lines.push(`\nSkills:\n${resumeData.skills.join(", ")}`);
    }
    if (resumeData.WorkExp && resumeData.WorkExp.length > 0) {
      lines.push("\nWork Experience:");
      resumeData.WorkExp.forEach((w) => {
        lines.push(`${w.position} at ${w.company} (${w.startdate} - ${w.enddate})`);
        if (w.description) lines.push(w.description);
      });
    }
    if (resumeData.Projects && resumeData.Projects.length > 0) {
      lines.push("\nProjects:");
      resumeData.Projects.forEach((pr) => {
        lines.push(`${pr.title} [${pr.techStack?.join(", ")}]`);
        if (pr.description) lines.push(pr.description);
      });
    }
    if (resumeData.Education && resumeData.Education.length > 0) {
      lines.push("\nEducation:");
      resumeData.Education.forEach((e) => {
        lines.push(`${e.degree} - ${e.institute} (${e.startdate} - ${e.enddate})`);
      });
    }
    return lines.join("\n");
  };

  const handleRunAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const text = compileResumeText();
      if (!text || text.length < 50) {
        setError("Please fill out more sections of your resume before running ATS analysis.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/ai/ats-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumetext: text }),
      });
      const data = await res.json();
      if (data.success && data.data?.atsdata) {
        setAtsResult(data.data.atsdata);
      } else {
        setError(data.message || "Failed to analyze resume");
      }
    } catch {
      setError("Network error while connecting to ATS engine");
    } finally {
      setLoading(false);
    }
  };

  // Compute overall score
  const breakdown = atsResult?.breakdown || {
    keywords: 0,
    sections: 0,
    content: 0,
    formatting: 0,
  };
  const totalScore = Math.min(
    100,
    (breakdown.keywords || 0) +
      (breakdown.sections || 0) +
      (breakdown.content || 0) +
      (breakdown.formatting || 0)
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 border-emerald-500 bg-emerald-50";
    if (score >= 60) return "text-amber-600 border-amber-500 bg-amber-50";
    return "text-rose-600 border-rose-500 bg-rose-50";
  };

  const handleAddKeyword = (kw: string) => {
    onAddSkill(kw);
    setAddedKeywords({ ...addedKeywords, [kw]: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <SparklesIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI ATS Score & Keyword Audit
              </h2>
              <p className="text-xs text-slate-500">
                Strict Applicant Tracking System evaluation with actionable feedback
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-lg p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!atsResult && !loading && (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 mx-auto bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                🎯
              </div>
              <h3 className="text-sm font-semibold text-slate-900">
                Ready to analyze your resume against ATS bots?
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                We will grade keyword relevance, structure completeness, quantifiable impact, and formatting to help you pass automated recruiter filters.
              </p>
              {error && <p className="text-xs text-rose-600">{error}</p>}
              <button
                onClick={handleRunAnalysis}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <SparklesIcon className="w-4 h-4" />
                <span>Run Full ATS Audit</span>
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3">
              <Spinner className="w-8 h-8 text-indigo-600 mx-auto" />
              <p className="text-xs font-semibold text-slate-700">
                Analyzing resume against ATS scoring algorithms...
              </p>
              <p className="text-[11px] text-slate-400">
                Evaluating keywords, action verbs, and section completeness
              </p>
            </div>
          )}

          {atsResult && !loading && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Overall ATS Compatibility
                  </div>
                  <div className="text-2xl font-extrabold text-slate-900">
                    {totalScore >= 80
                      ? "Excellent Candidate Profile"
                      : totalScore >= 60
                      ? "Good, but needs refinement"
                      : "Needs Significant Optimization"}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scored out of 100 based on strict corporate filtering criteria
                  </p>
                </div>

                <div
                  className={`w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center font-black ${getScoreColor(
                    totalScore
                  )}`}
                >
                  <span className="text-2xl leading-none">{totalScore}</span>
                  <span className="text-[10px] font-semibold text-slate-500">/ 100</span>
                </div>
              </div>

              {/* Breakdown Bars */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Scoring Breakdown
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-medium">Keywords Relevance</span>
                      <span className="font-bold text-slate-900">{breakdown.keywords || 0} / 30</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((breakdown.keywords || 0) / 30) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-medium">Section Completeness</span>
                      <span className="font-bold text-slate-900">{breakdown.sections || 0} / 25</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((breakdown.sections || 0) / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-medium">Content Impact & Verbs</span>
                      <span className="font-bold text-slate-900">{breakdown.content || 0} / 25</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((breakdown.content || 0) / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70">
                    <div className="flex justify-between mb-1">
                      <span className="text-slate-700 font-medium">Formatting & Readability</span>
                      <span className="font-bold text-slate-900">{breakdown.formatting || 0} / 20</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${((breakdown.formatting || 0) / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Sections */}
              {atsResult.missingSections && atsResult.missingSections.length > 0 && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-1">
                    Missing Required Sections
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missingSections.map((sec: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 bg-white text-rose-700 border border-rose-200 rounded text-xs font-medium"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths & Improvements */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                    Key Strengths
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {atsResult.strengths?.map((str: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                    Actionable Improvements
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {atsResult.improvements?.map((imp: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold shrink-0 mt-0.5">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Suggested Keywords */}
              {atsResult.suggestedKeywords && atsResult.suggestedKeywords.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    High-Value Keywords to Add
                  </h4>
                  <p className="text-xs text-slate-500">
                    Click any keyword below to directly append it to your resume skills list.
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {atsResult.suggestedKeywords.map((kw: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleAddKeyword(kw)}
                        disabled={addedKeywords[kw]}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition ${
                          addedKeywords[kw]
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                            : "bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50"
                        }`}
                      >
                        <span>{addedKeywords[kw] ? "✓" : "+"}</span>
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex justify-between items-center">
          {atsResult ? (
            <button
              onClick={handleRunAnalysis}
              disabled={loading}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              <span>Re-run Audit</span>
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 bg-slate-100 rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

