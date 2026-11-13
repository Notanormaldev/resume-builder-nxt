"use client";

import React, { useState } from "react";
import { IProjects } from "@/types/resume.type";
import { PlusIcon, TrashIcon, SparklesIcon, Spinner } from "../Icons";

interface ProjectsStepProps {
  projects: IProjects[];
  onChange: (items: IProjects[]) => void;
  targetRole?: string;
}

export default function ProjectsStep({
  projects = [],
  onChange,
  targetRole = "Software Engineer",
}: ProjectsStepProps) {
  const [activeAiIndex, setActiveAiIndex] = useState<number | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);
  const [expLevel, setExpLevel] = useState("Mid-level");
  const [tempTag, setTempTag] = useState<{ [key: number]: string }>({});

  const addProject = () => {
    const newItem: IProjects = {
      title: "",
      description: "",
      techStack: [],
      githuburl: "",
      liveurl: "",
    };
    onChange([...projects, newItem]);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, idx) => idx !== index));
  };

  const updateItem = (index: number, field: keyof IProjects, val: any) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const addTechTag = (index: number) => {
    const tag = (tempTag[index] || "").trim();
    if (!tag) return;
    const current = projects[index].techStack || [];
    if (!current.includes(tag)) {
      updateItem(index, "techStack", [...current, tag]);
    }
    setTempTag({ ...tempTag, [index]: "" });
  };

  const removeTechTag = (projIndex: number, tagIndex: number) => {
    const current = projects[projIndex].techStack || [];
    updateItem(
      projIndex,
      "techStack",
      current.filter((_, idx) => idx !== tagIndex)
    );
  };

  const generateProjectDescription = async (index: number) => {
    const item = projects[index];
    if (!item.title) {
      alert("Please provide a project name first.");
      return;
    }
    setLoadingAi(true);
    try {
      const res = await fetch("/api/ai/gen-project-des", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: targetRole || "Software Developer",
          experiencelevel: expLevel,
          techstack: item.techStack && item.techStack.length > 0 ? item.techStack : ["Next.js", "TypeScript"],
          pname: item.title,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.description) {
        updateItem(index, "description", data.data.description.trim());
        setActiveAiIndex(null);
      } else {
        alert(data.message || "Failed to generate project description");
      }
    } catch {
      alert("Error generating project description with AI");
    } finally {
      setLoadingAi(false);
    }
  };

  const polishDescription = async (index: number) => {
    const item = projects[index];
    if (!item.description || item.description.length < 15) {
      alert("Please enter a short description to polish.");
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
        alert(data.message || "Could not polish description");
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
              <span>Key Projects</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Step 5 of 7
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Demonstrate hands-on initiative with notable open-source work, client builds, or high-impact apps.
            </p>
          </div>

          <button
            type="button"
            onClick={addProject}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-3">No projects added yet.</p>
            <button
              onClick={addProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Your First Project</span>
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white transition-all space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Project #{index + 1}: {item.title || "Untitled Project"}
                  </span>
                  <button
                    onClick={() => removeProject(index)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Project Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.title || ""}
                      onChange={(e) => updateItem(index, "title", e.target.value)}
                      placeholder="e.g. Distributed Task Queue"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Live Demo URL</label>
                    <input
                      type="text"
                      value={item.liveurl || ""}
                      onChange={(e) => updateItem(index, "liveurl", e.target.value)}
                      placeholder="e.g. app.demo.io"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Repository URL</label>
                    <input
                      type="text"
                      value={item.githuburl || ""}
                      onChange={(e) => updateItem(index, "githuburl", e.target.value)}
                      placeholder="e.g. github.com/user/project"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Tech Stack Tags */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">
                    Technologies / Tools Used
                  </label>
                  <div className="flex flex-wrap items-center gap-1.5 mb-2">
                    {item.techStack?.map((tech, tidx) => (
                      <span
                        key={tidx}
                        className="inline-flex items-center gap-1 text-xs bg-slate-200/80 text-slate-800 px-2 py-0.5 rounded-md"
                      >
                        <span>{tech}</span>
                        <button
                          onClick={() => removeTechTag(index, tidx)}
                          className="text-slate-500 hover:text-slate-900 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 max-w-sm">
                    <input
                      type="text"
                      value={tempTag[index] || ""}
                      onChange={(e) => setTempTag({ ...tempTag, [index]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTechTag(index);
                        }
                      }}
                      placeholder="Type a tech (e.g. Next.js) and press Enter"
                      className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => addTechTag(index)}
                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-700">
                      Project Description & Impact
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

                  {/* AI Generator Accordion */}
                  {activeAiIndex === index && (
                    <div className="mb-3 p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs space-y-2">
                      <div className="flex justify-between font-semibold text-indigo-900">
                        <span>Generate project summary for &quot;{item.title || "this project"}&quot;</span>
                        <button onClick={() => setActiveAiIndex(null)} className="text-slate-400">
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-600">Experience level:</span>
                        <select
                          value={expLevel}
                          onChange={(e) => setExpLevel(e.target.value)}
                          className="text-xs px-2 py-1 rounded bg-white border border-slate-200"
                        >
                          <option value="Entry-level">Entry-level</option>
                          <option value="Mid-level">Mid-level</option>
                          <option value="Senior">Senior</option>
                        </select>
                        <button
                          onClick={() => generateProjectDescription(index)}
                          disabled={loadingAi}
                          className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-medium"
                        >
                          {loadingAi ? <Spinner className="w-3 h-3" /> : <SparklesIcon className="w-3 h-3" />}
                          <span>Generate</span>
                        </button>
                      </div>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    value={item.description || ""}
                    onChange={(e) => updateItem(index, "description", e.target.value)}
                    placeholder="Built a real-time collaborative workspace supporting 500 concurrent connections, achieving 99.9% uptime..."
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

