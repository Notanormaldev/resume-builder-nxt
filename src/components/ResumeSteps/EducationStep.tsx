"use client";

import React from "react";
import { IEducation } from "@/types/resume.type";
import { PlusIcon, TrashIcon } from "../Icons";

interface EducationStepProps {
  education: IEducation[];
  onChange: (items: IEducation[]) => void;
}

export default function EducationStep({ education = [], onChange }: EducationStepProps) {
  const addEducation = () => {
    const newItem: IEducation = {
      institute: "",
      degree: "",
      startdate: "",
      enddate: "",
    };
    onChange([...education, newItem]);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, idx) => idx !== index));
  };

  const updateItem = (index: number, field: keyof IEducation, val: string) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Education</span>
              <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                Step 4 of 7
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Add your degrees, diplomas, university qualifications, or relevant academic courses.
            </p>
          </div>

          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Add Education</span>
          </button>
        </div>

        {education.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <p className="text-xs text-slate-500 mb-3">No education history added.</p>
            <button
              onClick={addEducation}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add Degree</span>
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {education.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/30 hover:bg-white transition-all space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    School / College #{index + 1}
                  </span>
                  <button
                    onClick={() => removeEducation(index)}
                    className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 hover:bg-rose-50 px-2 py-1 rounded-lg transition"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      Degree / Major <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.degree || ""}
                      onChange={(e) => updateItem(index, "degree", e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                      School / University <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={item.institute || ""}
                      onChange={(e) => updateItem(index, "institute", e.target.value)}
                      placeholder="e.g. Stanford University"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Start Year</label>
                    <input
                      type="text"
                      value={item.startdate || ""}
                      onChange={(e) => updateItem(index, "startdate", e.target.value)}
                      placeholder="e.g. 2018"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="text"
                      value={item.enddate || ""}
                      onChange={(e) => updateItem(index, "enddate", e.target.value)}
                      placeholder="e.g. 2022"
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

