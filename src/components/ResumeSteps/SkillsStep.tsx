"use client";

import React, { useState } from "react";
import { PlusIcon, SparklesIcon, Spinner } from "../Icons";

interface SkillsStepProps {
  skills: string[];
  onChange: (items: string[]) => void;
  targetRole?: string;
}

const COMMON_PRESETS = [
  "JavaScript",
  "TypeScript",
  "React.js",
  "Next.js",
  "Node.js",
  "Express.js",
  "Python",
  "SQL",
  "PostgreSQL",
  "MongoDB",
  "REST APIs",
  "GraphQL",
  "Docker",
  "AWS",
  "Git & GitHub",
  "Tailwind CSS",
  "System Design",
  "Agile / Scrum",
];

export default function SkillsStep({
  skills = [],
  onChange,
  targetRole = "Software Engineer",
}: SkillsStepProps) {
  const [inputVal, setInputVal] = useState("");
  const [roleInput, setRoleInput] = useState(targetRole || "Software Developer");
  const [expLevel, setExpLevel] = useState("Mid-level");
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showAiSuggest, setShowAiSuggest] = useState(false);

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputVal);
      setInputVal("");
    }
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleAiSuggestSkills = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch("/api/ai/gen-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: roleInput,
          experiencelevel: expLevel,
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data?.skills)) {
        const newSet = new Set([...skills, ...data.data.skills]);
        onChange(Array.from(newSet));
        setShowAiSuggest(false);
      } else {
        alert(data.message || "Could not fetch AI skills");
      }
    } catch {
      alert("Error generating skills with AI");
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Skills & Competencies</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Step 6 of 7
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              ATS algorithms match your resume skills directly against the job requirements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAiSuggest(!showAiSuggest)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-xs hover:from-indigo-600 transition"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>AI Skills Recommender</span>
          </button>
        </div>

        {/* AI Skills Drawer */}
        {showAiSuggest && (
          <div className="mb-5 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-950">
              <span className="flex items-center gap-1.5">
                <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
                Tailor in-demand keywords for your target role
              </span>
              <button
                onClick={() => setShowAiSuggest(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Job Title</label>
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  placeholder="e.g. Backend Go Engineer"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">Target Level</label>
                <select
                  value={expLevel}
                  onChange={(e) => setExpLevel(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Entry-level">Entry-level</option>
                  <option value="Mid-level">Mid-level</option>
                  <option value="Senior">Senior</option>
                  <option value="Staff/Architect">Staff / Architect</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleAiSuggestSkills}
                disabled={isLoadingAi}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-50"
              >
                {isLoadingAi ? <Spinner className="w-3.5 h-3.5 text-white" /> : <SparklesIcon className="w-3.5 h-3.5" />}
                <span>Suggest & Auto-Add Skills</span>
              </button>
            </div>
          </div>
        )}

        {/* Manual Add Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and hit Enter or comma (e.g. React.js, GraphQL)"
            className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
          />
          <button
            type="button"
            onClick={() => {
              addSkill(inputVal);
              setInputVal("");
            }}
            className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>

        {/* Current Skills Cloud */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Selected Skills ({skills.length})
          </label>
          {skills.length === 0 ? (
            <div className="text-xs text-slate-400 italic py-2">
              No skills added yet. Type above or pick from popular presets below.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 p-3 bg-slate-50/60 rounded-xl border border-slate-200/60 min-h-[50px]">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-indigo-200 text-indigo-900 rounded-lg text-xs font-medium shadow-2xs hover:border-indigo-400 transition"
                >
                  <span>{skill}</span>
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-slate-400 hover:text-rose-500 font-bold ml-0.5"
                    title="Remove skill"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Quick Suggestions / Presets */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <span className="block text-xs font-semibold text-slate-500 mb-2">
            Quick Add Popular Tech Skills:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_PRESETS.filter((p) => !skills.includes(p)).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addSkill(preset)}
                className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition flex items-center gap-1"
              >
                <span>+</span>
                <span>{preset}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

