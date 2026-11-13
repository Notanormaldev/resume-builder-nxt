"use client";

import React from "react";
import { IPersonalInfo } from "@/types/resume.type";

interface PersonalStepProps {
  data: IPersonalInfo;
  onChange: (updated: IPersonalInfo) => void;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function PersonalStep({
  data,
  onChange,
  title,
  onTitleChange,
}: PersonalStepProps) {
  const handleChange = (field: keyof IPersonalInfo, val: string) => {
    onChange({
      ...data,
      [field]: val,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center justify-between">
          <span>Personal Information</span>
          <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
            Step 1 of 7
          </span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Recruiters use this information to contact you. Keep your email and phone up to date.
        </p>

        {/* Resume Name / Target Title */}
        <div className="mt-5 pb-5 border-b border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Resume Label / Title
          </label>
          <input
            type="text"
            value={title || ""}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Senior Frontend Engineer - Tech Resume"
            className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition bg-slate-50/50 hover:bg-white"
          />
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={data?.fullname || ""}
              onChange={(e) => handleChange("fullname", e.target.value)}
              placeholder="e.g. Jane Doe"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="email"
              value={data?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="e.g. jane.doe@example.com"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={data?.mobile || ""}
              onChange={(e) => handleChange("mobile", e.target.value)}
              placeholder="e.g. +1 (555) 019-2834"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Location / City, Country
            </label>
            <input
              type="text"
              value={data?.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="e.g. New York, NY (or Remote)"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              LinkedIn Profile URL
            </label>
            <input
              type="text"
              value={data?.linkdin || ""}
              onChange={(e) => handleChange("linkdin", e.target.value)}
              placeholder="e.g. linkedin.com/in/janedoe"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              GitHub Profile URL
            </label>
            <input
              type="text"
              value={String(data?.github || "")}
              onChange={(e) => handleChange("github", e.target.value)}
              placeholder="e.g. github.com/janedoe"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Portfolio / Personal Website
            </label>
            <input
              type="text"
              value={data?.portfolio || ""}
              onChange={(e) => handleChange("portfolio", e.target.value)}
              placeholder="e.g. janedoe.dev"
              className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

