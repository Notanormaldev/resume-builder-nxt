"use client";

import React, { useState } from "react";
import { IWorkExp } from "@/types/resume.type";
import { PlusIcon, TrashIcon, SparklesIcon, Spinner } from "../Icons";

interface ExperienceStepProps {
  work: IWorkExp[];
  onChange: (items: IWorkExp[]) => void;
}

export default function ExperienceStep({ work = [], onChange }: ExperienceStepProps) {
  const [activeAiIndex, setActiveAiIndex] = useState<number | null>(null);
  const [yoe, setYoe] = useState("3");
  const [expLevel, setExpLevel] = useState("Mid-level");
  const [techStackInput, setTechStackInput] = useState("React, Node.js, AWS");
  const [loadingAi, setLoadingAi] = useState(false);
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);

  const addExperience = () => {
    const newItem: IWorkExp = {
      company: "",
      position: "",
      startdate: "",
      enddate: "Present",
      description: "",
    };
    onChange([...work, newItem]);
  };

  const removeExperience = (index: number) => {
    const updated = work.filter((_, idx) => idx !== index);
    onChange(updated);
  };

  const updateItem = (index: number, field: keyof IWorkExp, val: string) => {
    const updated = [...work];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const generateExpDescription = async (index: number) => {
    const item = work[index];
    const role = item.position || "Software Engineer";
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/gen-exp-des", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobrole: role,
          experiencelevel: expLevel,
          yoe: yoe,
          techstack: techStackInput.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.workexpdes) {
        updateItem(index, "description", data.data.workexpdes.trim());
        setActiveAiIndex(null);
      } else {
        alert(data.message || "Failed to generate experience description");
      }
    } catch {
      alert("Error generating experience with AI");
    } finally {
      setLoadingAi(false);
    }
  };

  const polishDescription = async (index: number) => {
    const item = work[index];
    if (!item.description || item.description.length < 15) {
      alert("Please write a draft description first to polish.");
      return;
    }
    setPolishingIndex(index);
    try {
      const res = await fetch("/api/ai/improve-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: item.description }),
      });
      const data = await res.json();
      if (data.success && data.data?.newcontent) {
        updateItem(index, "description", data.data.newcontent.trim());
      } else {
        alert(data.message || "Could not polish content");
      }
    } catch {
      alert("Error polishing description");
    } finally {
      setPolishingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Work Experience</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Step 3 of 7
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Highlight roles, accomplishments, metrics, and technology impact in reverse chronological order.
            </p>
          </div>

          <button
            type="button"
            onClick={addExperience}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>

        {work.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-3">No work experience added yet.</p>
            <button
              onClick={addExperience}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Your First Job</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {work.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white transition-all space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Role #{index + 1}: {item.position || "Untitled Position"}
                  </span>
                  <button
                    onClick={() => removeExperience(index)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                    title="Delete position"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Job Title / Position <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.position || ""}
                      onChange={(e) => updateItem(index, "position", e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Company / Organization <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.company || ""}
                      onChange={(e) => updateItem(index, "company", e.target.value)}
                      placeholder="e.g. Stripe, Google, Acme Corp"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={item.startdate || ""}
                      onChange={(e) => updateItem(index, "startdate", e.target.value)}
                      placeholder="e.g. Jan 2022"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">End Date</label>
                    <input
                      type="text"
                      value={item.enddate || ""}
                      onChange={(e) => updateItem(index, "enddate", e.target.value)}
                      placeholder="e.g. Present or Dec 2023"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Responsibilities & Key Achievements
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveAiIndex(activeAiIndex === index ? null : index)
                        }
                        className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md"
                      >
                        <SparklesIcon className="w-3 h-3" />
                        <span>AI Assistant</span>
                      </button>

                      {item.description && item.description.length > 20 && (
                        <button
                          type="button"
                          disabled={polishingIndex === index}
                          onClick={() => polishDescription(index)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md"
                        >
                          {polishingIndex === index ? (
                            <Spinner className="w-3 h-3" />
                          ) : (
                            <SparklesIcon className="w-3 h-3 text-amber-500" />
                          )}
                          <span>Polish</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* AI Quick Generator Drawer */}
                  {activeAiIndex === index && (
                    <div className="mb-3 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs space-y-2">
                      <div className="font-semibold text-indigo-900 flex justify-between">
                        <span>Generate bullet-point description with AI</span>
                        <button
                          onClick={() => setActiveAiIndex(null)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-slate-600 block">Experience Level</label>
                          <select
                            value={expLevel}
                            onChange={(e) => setExpLevel(e.target.value)}
                            className="w-full text-xs px-2 py-1 rounded bg-white border border-slate-200"
                          >
                            <option value="Junior">Junior</option>
                            <option value="Mid-level">Mid-level</option>
                            <option value="Senior">Senior</option>
                            <option value="Lead">Lead</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block">Years in Role</label>
                          <input
                            type="number"
                            value={yoe}
                            onChange={(e) => setYoe(e.target.value)}
                            className="w-full text-xs px-2 py-1 rounded bg-white border border-slate-200"
                            placeholder="3"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-slate-600 block">Tech Stack used</label>
                          <input
                            type="text"
                            value={techStackInput}
                            onChange={(e) => setTechStackInput(e.target.value)}
                            className="w-full text-xs px-2 py-1 rounded bg-white border border-slate-200"
                            placeholder="React, Redux, Node.js"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => generateExpDescription(index)}
                          disabled={loadingAi}
                          className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                        >
                          {loadingAi ? <Spinner className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3" />}
                          <span>Generate Content</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <textarea
                    rows={4}
                    value={item.description || ""}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="• Spearheaded development of core microservices, improving throughput by 40%...&#10;• Mentored 4 engineers and instituted automated test standards..."
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 bg-white leading-relaxed focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

