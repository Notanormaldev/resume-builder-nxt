"use client";

import React, { useState } from "react";
import { IResume } from "@/types/resume.type";
import { PrinterIcon, EyeIcon } from "./Icons";

interface ResumePreviewProps {
  data: Partial<IResume>;
  onPrint?: () => void;
}

export type TemplateType = "modern" | "classic" | "tech";

export default function ResumePreview({ data, onPrint }: ResumePreviewProps) {
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [scale, setScale] = useState<number>(100);

  const {
    PersonalInfo,
    summary,
    WorkExp = [],
    Education = [],
    Projects = [],
    skills = [],
    certifications = [],
    acheivements = [],
  } = data;

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {/* Top Preview Controls (No-Print) */}
      <div className="no-print bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <EyeIcon className="w-4 h-4 text-indigo-600" />
            Live Preview
          </span>
          <div className="h-4 w-px bg-slate-200 mx-1" />
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setTemplate("modern")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                template === "modern"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Modern
            </button>
            <button
              onClick={() => setTemplate("classic")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                template === "classic"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Executive
            </button>
            <button
              onClick={() => setTemplate("tech")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                template === "tech"
                  ? "bg-white text-indigo-600 shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Tech
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-xs text-slate-600">
            <button
              onClick={() => setScale((s) => Math.max(70, s - 10))}
              className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold"
              title="Zoom out"
            >
              -
            </button>
            <span className="w-9 text-center font-mono">{scale}%</span>
            <button
              onClick={() => setScale((s) => Math.min(120, s + 10))}
              className="px-1.5 py-0.5 hover:bg-slate-200 rounded font-bold"
              title="Zoom in"
            >
              +
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition"
          >
            <PrinterIcon className="w-3.5 h-3.5 text-slate-500" />
            <span>PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Canvas Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start">
        <div
          style={{ transform: `scale(${scale / 100})`, transformOrigin: "top center" }}
          className="transition-transform duration-150 ease-out w-full max-w-[800px]"
        >
          {/* A4 Paper Container */}
          <div
            id="resume-content-print"
            className="resume-paper bg-white shadow-xl rounded-sm text-slate-900 border border-slate-200 p-8 md:p-12 min-h-[1050px]"
          >
            {template === "modern" && (
              <ModernLayout
                info={PersonalInfo}
                summary={summary}
                work={WorkExp}
                edu={Education}
                projects={Projects}
                skills={skills}
                certs={certifications}
                achievements={acheivements}
              />
            )}
            {template === "classic" && (
              <ClassicLayout
                info={PersonalInfo}
                summary={summary}
                work={WorkExp}
                edu={Education}
                projects={Projects}
                skills={skills}
                certs={certifications}
                achievements={acheivements}
              />
            )}
            {template === "tech" && (
              <TechLayout
                info={PersonalInfo}
                summary={summary}
                work={WorkExp}
                edu={Education}
                projects={Projects}
                skills={skills}
                certs={certifications}
                achievements={acheivements}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------- TEMPLATE 1: MODERN ACCENT -----------------
function ModernLayout({
  info,
  summary,
  work,
  edu,
  projects,
  skills,
  certs,
  achievements,
}: any) {
  return (
    <div className="space-y-6 text-slate-800 text-[13px] leading-relaxed">
      {/* Header */}
      <header className="border-b-2 border-indigo-600 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-950 tracking-tight">
          {info?.fullname || "Your Full Name"}
        </h1>
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs text-slate-600">
          {info?.email && <span>{info.email}</span>}
          {info?.mobile && <span>• {info.mobile}</span>}
          {info?.location && <span>• {info.location}</span>}
          {info?.portfolio && <span>• {info.portfolio}</span>}
          {info?.linkdin && <span>• {info.linkdin}</span>}
          {info?.github && <span>• {info.github}</span>}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
            Professional Summary
          </h2>
          <p className="text-slate-700 text-justify">{summary}</p>
        </section>
      )}

      {/* Work Experience */}
      {work && work.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2.5">
            Experience
          </h2>
          <div className="space-y-3.5">
            {work.map((item: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline font-semibold text-slate-900">
                  <span className="text-[14px]">
                    {item.position || "Position"}{" "}
                    <span className="text-indigo-600 font-medium">@ {item.company || "Company"}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-normal">
                    {item.startdate} {item.startdate && item.enddate ? "–" : ""} {item.enddate}
                  </span>
                </div>
                {item.description && (
                  <p className="text-slate-600 mt-1 whitespace-pre-line">{item.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2.5">
            Key Projects
          </h2>
          <div className="space-y-3">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between items-baseline">
                  <div className="font-semibold text-slate-900">
                    <span>{proj.title || "Project Title"}</span>
                    {proj.liveurl && (
                      <span className="text-xs text-indigo-600 ml-2 font-normal">
                        ({proj.liveurl})
                      </span>
                    )}
                  </div>
                  {proj.githuburl && (
                    <span className="text-xs text-slate-400 font-mono">{proj.githuburl}</span>
                  )}
                </div>
                {proj.description && (
                  <p className="text-slate-600 mt-0.5">{proj.description}</p>
                )}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {proj.techStack.map((tech: string, tidx: number) => (
                      <span
                        key={tidx}
                        className="bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
            Technical Skills
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill: string, i: number) => (
              <span
                key={i}
                className="bg-indigo-50/70 text-indigo-900 border border-indigo-100 px-2 py-0.5 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {edu && edu.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2">
            Education
          </h2>
          <div className="space-y-2">
            {edu.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-baseline">
                <div>
                  <span className="font-semibold text-slate-900">{item.degree}</span>
                  <span className="text-slate-600 ml-1.5">• {item.institute}</span>
                </div>
                <span className="text-xs text-slate-500 font-normal">
                  {item.startdate} {item.startdate && item.enddate ? "–" : ""} {item.enddate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Achievements */}
      {((certs && certs.length > 0) || (achievements && achievements.length > 0)) && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          {certs && certs.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
                Certifications
              </h2>
              <ul className="list-disc list-inside text-xs space-y-0.5 text-slate-700">
                {certs.map((c: string, idx: number) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          )}
          {achievements && achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1.5">
                Achievements
              </h2>
              <ul className="list-disc list-inside text-xs space-y-0.5 text-slate-700">
                {achievements.map((a: string, idx: number) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// ----------------- TEMPLATE 2: CLASSIC EXECUTIVE -----------------
function ClassicLayout({
  info,
  summary,
  work,
  edu,
  projects,
  skills,
  certs,
  achievements,
}: any) {
  return (
    <div className="space-y-5 text-slate-800 text-[13px] font-serif leading-relaxed">
      {/* Centered Header */}
      <header className="text-center border-b border-slate-300 pb-4">
        <h1 className="text-2xl font-bold tracking-wide text-slate-950 uppercase font-serif">
          {info?.fullname || "Your Full Name"}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-x-2 mt-1.5 text-xs text-slate-600 font-sans">
          {info?.location && <span>{info.location}</span>}
          {info?.email && <span>| {info.email}</span>}
          {info?.mobile && <span>| {info.mobile}</span>}
          {info?.portfolio && <span>| {info.portfolio}</span>}
          {info?.linkdin && <span>| {info.linkdin}</span>}
        </div>
      </header>

      {summary && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 font-sans">
            Executive Summary
          </h2>
          <p className="text-slate-800 text-justify">{summary}</p>
        </section>
      )}

      {work && work.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-2 font-sans">
            Professional Experience
          </h2>
          <div className="space-y-3">
            {work.map((item: any, i: number) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>
                    {item.company} <span className="font-normal italic">({item.position})</span>
                  </span>
                  <span className="text-xs font-sans text-slate-600">
                    {item.startdate} {item.startdate && item.enddate ? "–" : ""} {item.enddate}
                  </span>
                </div>
                {item.description && <p className="text-slate-700 mt-1">{item.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {edu && edu.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-2 font-sans">
            Education
          </h2>
          <div className="space-y-1.5">
            {edu.map((item: any, i: number) => (
              <div key={i} className="flex justify-between">
                <div>
                  <span className="font-bold text-slate-900">{item.institute}</span>
                  <span className="italic text-slate-700 ml-2">— {item.degree}</span>
                </div>
                <span className="text-xs font-sans text-slate-600">
                  {item.startdate} {item.startdate && item.enddate ? "–" : ""} {item.enddate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-1.5 font-sans">
            Core Competencies
          </h2>
          <p className="text-slate-800 text-xs font-sans">
            {skills.join(" • ")}
          </p>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-2 font-sans">
            Selected Projects
          </h2>
          <div className="space-y-2">
            {projects.map((proj: any, i: number) => (
              <div key={i}>
                <div className="font-bold text-slate-900">
                  {proj.title}
                  {proj.liveurl && <span className="text-xs font-normal text-slate-500 font-sans ml-2">[{proj.liveurl}]</span>}
                </div>
                {proj.description && <p className="text-slate-700 text-xs">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ----------------- TEMPLATE 3: TECH MINIMALIST -----------------
function TechLayout({
  info,
  summary,
  work,
  edu,
  projects,
  skills,
  certs,
  achievements,
}: any) {
  return (
    <div className="space-y-5 text-slate-900 text-xs font-mono leading-relaxed">
      <header className="border-b-2 border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {info?.fullname || "Full Name"}
            </h1>
            <p className="text-slate-600 text-[11px] mt-0.5">
              {info?.email} • {info?.mobile} • {info?.location}
            </p>
          </div>
          <div className="text-right text-[10px] text-slate-500">
            {info?.github && <div>{info.github}</div>}
            {info?.portfolio && <div>{info.portfolio}</div>}
          </div>
        </div>
      </header>

      {summary && (
        <section>
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1">
            // SUMMARY
          </div>
          <p className="text-slate-800 font-sans text-xs leading-normal">{summary}</p>
        </section>
      )}

      {skills && skills.length > 0 && (
        <section>
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">
            // TECH_STACK
          </div>
          <div className="flex flex-wrap gap-1">
            {skills.map((s: string, idx: number) => (
              <span key={idx} className="bg-slate-900 text-white px-1.5 py-0.5 rounded text-[10px]">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {work && work.length > 0 && (
        <section>
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            // EXPERIENCE
          </div>
          <div className="space-y-3 font-sans">
            {work.map((w: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between font-mono text-xs font-bold text-slate-900">
                  <span>{w.position} @ {w.company}</span>
                  <span className="text-[11px] text-slate-500 font-normal">{w.startdate} – {w.enddate}</span>
                </div>
                <p className="text-slate-700 text-xs mt-1">{w.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects && projects.length > 0 && (
        <section>
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-2">
            // PROJECTS
          </div>
          <div className="space-y-2.5 font-sans">
            {projects.map((p: any, idx: number) => (
              <div key={idx}>
                <div className="font-mono text-xs font-bold text-slate-900 flex justify-between">
                  <span>{p.title}</span>
                  {p.liveurl && <span className="text-[10px] text-indigo-600 font-mono">{p.liveurl}</span>}
                </div>
                <p className="text-slate-700 text-xs mt-0.5">{p.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {edu && edu.length > 0 && (
        <section>
          <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase mb-1.5">
            // EDUCATION
          </div>
          {edu.map((e: any, idx: number) => (
            <div key={idx} className="flex justify-between text-xs">
              <span>{e.degree} - {e.institute}</span>
              <span className="text-slate-500">{e.startdate} - {e.enddate}</span>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

