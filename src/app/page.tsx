"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import ResumePreview from "@/components/ResumePreview";
import ATSModal from "@/components/ATSModal";
import AuthModal from "@/components/AuthModal";

// Step components
import PersonalStep from "@/components/ResumeSteps/PersonalStep";
import SummaryStep from "@/components/ResumeSteps/SummaryStep";
import ExperienceStep from "@/components/ResumeSteps/ExperienceStep";
import EducationStep from "@/components/ResumeSteps/EducationStep";
import ProjectsStep from "@/components/ResumeSteps/ProjectsStep";
import SkillsStep from "@/components/ResumeSteps/SkillsStep";
import ExtraStep from "@/components/ResumeSteps/ExtraStep";

import {
  UserIcon,
  FileTextIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  FolderIcon,
  WrenchIcon,
  AwardIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "@/components/Icons";
import { IResume } from "@/types/resume.type";
import { SAMPLE_RESUME } from "@/lib/sampleResume";

const STEPS = [
  { id: "personal", label: "Profile", icon: UserIcon },
  { id: "summary", label: "Summary", icon: FileTextIcon },
  { id: "experience", label: "Experience", icon: BriefcaseIcon },
  { id: "education", label: "Education", icon: GraduationCapIcon },
  { id: "projects", label: "Projects", icon: FolderIcon },
  { id: "skills", label: "Skills", icon: WrenchIcon },
  { id: "extra", label: "Honors", icon: AwardIcon },
];

export default function ResumeBuilderPage() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [resumeData, setResumeData] = useState<Partial<IResume>>(() => {
    return {
      title: "Full Stack Engineer Resume",
      summary: "",
      PersonalInfo: {
        fullname: "",
        email: "",
        mobile: "",
        location: "",
        github: "",
        linkdin: "",
        portfolio: "",
      },
      WorkExp: [],
      Education: [],
      Projects: [],
      skills: [],
      certifications: [],
      acheivements: [],
    };
  });

  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [saveStatus, setSaveStatus] = useState<"saved" | "unsaved" | "saving">("saved");
  const [isSaving, setIsSaving] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Check auth status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.success && data.data?.user) {
          setCurrentUser(data.data.user);
          // Auto fill personal info name & email if empty
          setResumeData((prev) => ({
            ...prev,
            PersonalInfo: {
              ...prev.PersonalInfo!,
              fullname: prev.PersonalInfo?.fullname || data.data.user.name || "",
              email: prev.PersonalInfo?.email || data.data.user.email || "",
              mobile: prev.PersonalInfo?.mobile || data.data.user.mobile || "",
            },
          }));
        }
      } catch {}
    };
    checkAuth();
  }, []);

  // Save to backend
  const handleSaveToCloud = useCallback(async () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");

    try {
      if (activeResumeId) {
        // Update existing resume
        const res = await fetch(`/api/resumes/${activeResumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resumeData),
        });
        const json = await res.json();
        if (json.success) {
          setSaveStatus("saved");
        } else {
          setSaveStatus("unsaved");
        }
      } else {
        // Create new resume in DB
        const res = await fetch("/api/resumes/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const json = await res.json();
        if (json.success && json.data?._id) {
          const newId = json.data._id;
          setActiveResumeId(newId);
          // Sync current data to new resume
          await fetch(`/api/resumes/${newId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(resumeData),
          });
          setSaveStatus("saved");
        }
      }
    } catch {
      setSaveStatus("unsaved");
    } finally {
      setIsSaving(false);
    }
  }, [currentUser, activeResumeId, resumeData]);

  // Load sample resume for instant demonstration
  const handleLoadSample = () => {
    setResumeData(SAMPLE_RESUME);
    setSaveStatus("unsaved");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setActiveResumeId(null);
    } catch {}
  };

  // Helper to append a single skill from ATS recommendations
  const handleAddSkillFromAts = (skill: string) => {
    const existing = resumeData.skills || [];
    if (!existing.includes(skill)) {
      setResumeData({
        ...resumeData,
        skills: [...existing, skill],
      });
      setSaveStatus("unsaved");
    }
  };

  // Step Navigators
  const canGoPrev = currentStepIndex > 0;
  const canGoNext = currentStepIndex < STEPS.length - 1;

  return (
    <div className="min-h-screen bg-slate-100/60 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        title={resumeData.title || "My Professional Resume"}
        onTitleChange={(title) => {
          setResumeData({ ...resumeData, title });
          setSaveStatus("unsaved");
        }}
        onOpenATS={() => setShowAtsModal(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onLoadSample={handleLoadSample}
        onSaveCloud={handleSaveToCloud}
        onPrint={() => window.print()}
        isSaving={isSaving}
        saveStatus={saveStatus}
        currentUser={currentUser}
        onLogout={handleLogout}
        onToggleMobilePreview={() => setShowMobilePreview(!showMobilePreview)}
        showMobilePreview={showMobilePreview}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6 flex flex-col">
        {/* Step Progression Tabs */}
        <div className="no-print mb-5 bg-white p-2 rounded-2xl border border-slate-200/90 shadow-2xs overflow-x-auto">
          <div className="flex items-center min-w-max gap-1">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === currentStepIndex;
              const isPast = idx < currentStepIndex;

              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-xs"
                      : isPast
                      ? "text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/60"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-current"}`} />
                  <span>
                    {idx + 1}. {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: Interactive Builder (Left) + Live Reading Canvas (Right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left: Step Form Column */}
          <div
            className={`lg:col-span-6 flex flex-col space-y-4 ${
              showMobilePreview ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Step Content */}
            <div className="flex-1">
              {currentStepIndex === 0 && (
                <PersonalStep
                  data={resumeData.PersonalInfo!}
                  onChange={(info) => {
                    setResumeData({ ...resumeData, PersonalInfo: info });
                    setSaveStatus("unsaved");
                  }}
                  title={resumeData.title || ""}
                  onTitleChange={(t) => {
                    setResumeData({ ...resumeData, title: t });
                    setSaveStatus("unsaved");
                  }}
                />
              )}

              {currentStepIndex === 1 && (
                <SummaryStep
                  summary={resumeData.summary || ""}
                  onChange={(summary) => {
                    setResumeData({ ...resumeData, summary });
                    setSaveStatus("unsaved");
                  }}
                  defaultRole={resumeData.title || "Full Stack Developer"}
                  skillsList={resumeData.skills || []}
                />
              )}

              {currentStepIndex === 2 && (
                <ExperienceStep
                  work={resumeData.WorkExp || []}
                  onChange={(work) => {
                    setResumeData({ ...resumeData, WorkExp: work });
                    setSaveStatus("unsaved");
                  }}
                />
              )}

              {currentStepIndex === 3 && (
                <EducationStep
                  education={resumeData.Education || []}
                  onChange={(education) => {
                    setResumeData({ ...resumeData, Education: education });
                    setSaveStatus("unsaved");
                  }}
                />
              )}

              {currentStepIndex === 4 && (
                <ProjectsStep
                  projects={resumeData.Projects || []}
                  onChange={(projects) => {
                    setResumeData({ ...resumeData, Projects: projects });
                    setSaveStatus("unsaved");
                  }}
                  targetRole={resumeData.title || "Software Developer"}
                />
              )}

              {currentStepIndex === 5 && (
                <SkillsStep
                  skills={resumeData.skills || []}
                  onChange={(skills) => {
                    setResumeData({ ...resumeData, skills });
                    setSaveStatus("unsaved");
                  }}
                  targetRole={resumeData.title || "Software Engineer"}
                />
              )}

              {currentStepIndex === 6 && (
                <ExtraStep
                  certifications={resumeData.certifications || []}
                  onCertsChange={(certifications) => {
                    setResumeData({ ...resumeData, certifications });
                    setSaveStatus("unsaved");
                  }}
                  achievements={resumeData.acheivements || []}
                  onAchievementsChange={(acheivements) => {
                    setResumeData({ ...resumeData, acheivements });
                    setSaveStatus("unsaved");
                  }}
                />
              )}
            </div>

            {/* Stepper Footer Controls */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
              <button
                type="button"
                disabled={!canGoPrev}
                onClick={() => setCurrentStepIndex((i) => i - 1)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition disabled:opacity-40 disabled:hover:bg-slate-100"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Step {currentStepIndex + 1} of {STEPS.length}
              </div>

              {canGoNext ? (
                <button
                  type="button"
                  onClick={() => setCurrentStepIndex((i) => i + 1)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition"
                >
                  <span>Next Step</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAtsModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xs transition"
                >
                  <SparklesIcon className="w-3.5 h-3.5" />
                  <span>Review ATS Score</span>
                </button>
              )}
            </div>
          </div>

          {/* Right: Real-time Live Reading UI */}
          <div
            className={`lg:col-span-6 lg:sticky lg:top-20 h-[calc(100vh-100px)] ${
              !showMobilePreview ? "hidden lg:block" : "block"
            }`}
          >
            <ResumePreview data={resumeData} onPrint={() => window.print()} />
          </div>
        </div>
      </main>

      {/* ATS Scoring & Keyword Audit Modal */}
      <ATSModal
        isOpen={showAtsModal}
        onClose={() => setShowAtsModal(false)}
        resumeData={resumeData}
        onAddSkill={handleAddSkillFromAts}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
