"use client";

import React from "react";
import { SparklesIcon, PrinterIcon, Spinner, CloudCheckIcon } from "./Icons";

interface NavbarProps {
  title: string;
  onTitleChange: (val: string) => void;
  onOpenATS: () => void;
  onOpenAuth: () => void;
  onLoadSample: () => void;
  onSaveCloud: () => void;
  onPrint: () => void;
  isSaving: boolean;
  saveStatus: "saved" | "unsaved" | "saving";
  currentUser: any;
  onLogout: () => void;
  onToggleMobilePreview: () => void;
  showMobilePreview: boolean;
}

export default function Navbar({
  title,
  onTitleChange,
  onOpenATS,
  onOpenAuth,
  onLoadSample,
  onSaveCloud,
  onPrint,
  isSaving,
  saveStatus,
  currentUser,
  onLogout,
  onToggleMobilePreview,
  showMobilePreview,
}: NavbarProps) {
  return (
    <header className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 md:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Resume Title */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-xs">
              <SparklesIcon className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-slate-900 hidden sm:inline">
              Next<span className="text-indigo-600">Resume</span>
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block shrink-0" />

          {/* Inline Title Editor */}
          <div className="flex items-center gap-2 min-w-0">
            <input
              type="text"
              value={title || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Untitled Resume"
              className="text-xs font-semibold text-slate-800 bg-transparent hover:bg-slate-100/70 focus:bg-white focus:ring-1 focus:ring-indigo-500 rounded-lg px-2 py-1 truncate max-w-[140px] sm:max-w-[220px] transition"
            />
            {saveStatus === "saved" && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium shrink-0">
                <CloudCheckIcon className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === "saving" && (
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-indigo-600 font-medium shrink-0">
                <Spinner className="w-3.5 h-3.5" />
                <span>Saving...</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="hidden md:inline-block w-2 h-2 rounded-full bg-amber-400 shrink-0" title="Unsaved changes" />
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile Preview Toggle */}
          <button
            onClick={onToggleMobilePreview}
            className="lg:hidden text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700"
          >
            {showMobilePreview ? "Edit Form" : "Preview"}
          </button>

          {/* Quick Sample Button */}
          <button
            type="button"
            onClick={onLoadSample}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
            title="Load comprehensive sample resume to test immediately"
          >
            <span>Load Sample</span>
          </button>

          {/* ATS Analyzer Button */}
          <button
            type="button"
            onClick={onOpenATS}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 text-indigo-700 border border-indigo-200 shadow-2xs transition"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-600" />
            <span>ATS Audit</span>
          </button>

          {/* Cloud Save Button */}
          <button
            type="button"
            onClick={onSaveCloud}
            disabled={isSaving}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-700 transition disabled:opacity-50"
          >
            {isSaving ? <Spinner className="w-3.5 h-3.5" /> : null}
            <span>Save</span>
          </button>

          {/* Print / PDF Button */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition"
          >
            <PrinterIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>

          {/* Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
              <span className="text-xs font-semibold text-slate-700 max-w-[80px] truncate hidden md:inline">
                {currentUser.name}
              </span>
              <button
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-rose-600 px-2 py-1 rounded-lg hover:bg-slate-100 transition"
                title="Log out"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="text-xs font-semibold px-3 py-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

