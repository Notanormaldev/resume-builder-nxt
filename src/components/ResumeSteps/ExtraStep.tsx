"use client";

import React, { useState } from "react";
import { PlusIcon, TrashIcon } from "../Icons";

interface ExtraStepProps {
  certifications: string[];
  onCertsChange: (items: string[]) => void;
  achievements: string[];
  onAchievementsChange: (items: string[]) => void;
}

export default function ExtraStep({
  certifications = [],
  onCertsChange,
  achievements = [],
  onAchievementsChange,
}: ExtraStepProps) {
  const [newCert, setNewCert] = useState("");
  const [newAch, setNewAch] = useState("");

  const addCert = () => {
    if (newCert.trim()) {
      onCertsChange([...certifications, newCert.trim()]);
      setNewCert("");
    }
  };

  const removeCert = (index: number) => {
    onCertsChange(certifications.filter((_, i) => i !== index));
  };

  const addAch = () => {
    if (newAch.trim()) {
      onAchievementsChange([...achievements, newAch.trim()]);
      setNewAch("");
    }
  };

  const removeAch = (index: number) => {
    onAchievementsChange(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Certifications & Achievements</span>
            <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              Step 7 of 7
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Include high-value industry certifications, hackathon awards, honors, or open-source recognition.
          </p>
        </div>

        {/* Certifications Section */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Professional Certifications
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCert();
                }
              }}
              placeholder="e.g. AWS Certified Solutions Architect – Associate"
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <button
              type="button"
              onClick={addCert}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs"
              >
                <span className="text-slate-800 font-medium">{cert}</span>
                <button
                  onClick={() => removeCert(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements Section */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Key Honors & Achievements
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              value={newAch}
              onChange={(e) => setNewAch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAch();
                }
              }}
              placeholder="e.g. 1st Place Winner at HackMIT 2023 (300+ teams)"
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white"
            />
            <button
              type="button"
              onClick={addAch}
              className="flex items-center gap-1 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/60 rounded-lg text-xs"
              >
                <span className="text-slate-800 font-medium">{ach}</span>
                <button
                  onClick={() => removeAch(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

