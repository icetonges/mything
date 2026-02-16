import { Landmark, BookOpen, Scale, ArrowRight } from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 86400;

const POLICIES = [
  { name: "OMB Circular A-11", area: "Budget Formulation", desc: "Preparation, submission, and execution of the President\'s Budget. Governs all federal agency budget submissions.", peter: "Led preparation of $338B DoD budget submissions per A-11 requirements at the Pentagon." },
  { name: "OMB Circular A-123", area: "Internal Controls", desc: "Management\'s Responsibility for Enterprise Risk Management and Internal Control — the federal analog to SOX.", peter: "Supported A-123 assessments and remediation of material weaknesses at DoD OIG." },
  { name: "OMB Circular A-136", area: "Financial Reporting", desc: "Financial Reporting Requirements for federal agencies. Governs the Annual Financial Report (AFR/PAR).", peter: "Reviewed and analyzed agency AFRs for compliance with A-136 presentation requirements." },
  { name: "CFO Act of 1990", area: "Financial Management", desc: "Chief Financial Officers Act — mandates agency CFOs, annual audits, and financial management systems.", peter: "Operated within CFO Act framework throughout DoD career. Supported annual DoD audit readiness." },
  { name: "GPRA Modernization Act", area: "Performance Management", desc: "Government Performance and Results Act — links strategic goals to budget and performance reporting.", peter: "Aligned budget submissions to agency strategic plans and performance targets per GPRA requirements." },
  { name: "FASAB Standards", area: "Federal Accounting", desc: "Federal Accounting Standards Advisory Board — sets GAAP for federal government entities.", peter: "Applied FASAB standards to DoD financial statement preparation and audit support activities." },
  { name: "FIAR (DoD)", area: "Audit Readiness", desc: "Financial Improvement and Audit Readiness — DoD\'s program to achieve and sustain audit readiness.", peter: "Directly supported FIAR initiatives, tracking corrective action plans and audit finding remediation." },
];

const BUDGET_PHASES = [
  { step: 1, phase: "Formulation", time: "18 months ahead", desc: "Agencies develop internal budget requests. OMB A-11 guidance issued. Peter\'s role: prepare Congressional justification materials." },
  { step: 2, phase: "President\'s Budget", time: "Feb (Year N)", desc: "President submits budget to Congress. Detailed appendix and analytical perspectives published." },
  { step: 3, phase: "Congressional Action", time: "Feb–Sep", desc: "Budget Committees, Appropriations Committees mark up bills. Continuing resolutions common." },
  { step: 4, phase: "Enactment", time: "Oct 1 (ideal)", desc: "Appropriations signed into law. Agencies receive spending authority (BA, obligations, outlays defined)." },
  { step: 5, phase: "Execution", time: "Year N", desc: "Agency executes budget — allotments, apportionments, commitments, obligations, expenditures tracked." },
  { step: 6, phase: "Audit & Reporting", time: "Nov (following year)", desc: "Annual Financial Report published. Independent auditor issues opinion. Findings remediated for next cycle." },
];

export default function FedFinancePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <Landmark size={20} className="text-green-400" />
          </div>
          <h1 className="font-display text-3xl font-bold">Federal Finance</h1>
        </div>
        <p className="text-[hsl(var(--fg-muted))] max-w-2xl">15+ years in federal financial management — Pentagon GS-15, DoD OIG, U.S. Army. Deep expertise in federal budget policy, internal controls, and audit readiness.</p>
      </div>

      {/* Overview card */}
      <div className="card p-6 mb-10 border-green-500/20 bg-green-500/5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { val: "$338B", label: "Portfolio Managed", sub: "Pentagon GS-15" },
            { val: "15+", label: "Years Experience", sub: "Federal Finance" },
            { val: "3", label: "Major Agencies", sub: "Pentagon · OIG · Army" },
          ].map(s => (
            <div key={s.label} className="text-center sm:text-left">
              <p className="font-display text-3xl font-black gold">{s.val}</p>
              <p className="font-semibold text-sm mt-1">{s.label}</p>
              <p className="text-xs text-[hsl(var(--fg-muted))]">{s.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Budget lifecycle */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <Scale size={18} className="text-green-400" />
          <h2 className="font-display text-xl font-bold">Federal Budget Lifecycle</h2>
        </div>
        <div className="space-y-3">
          {BUDGET_PHASES.map((p, i) => (
            <div key={p.step} className="flex gap-4 card p-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-sm font-bold text-green-400">
                {p.step}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-semibold text-sm">{p.phase}</h3>
                  <span className="text-[10px] text-[hsl(var(--fg-muted))] border border-[hsl(var(--border))] px-2 py-0.5 rounded-full">{p.time}</span>
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">{p.desc}</p>
              </div>
              {i < BUDGET_PHASES.length - 1 && <ArrowRight size={14} className="text-[hsl(var(--fg-muted))] flex-shrink-0 mt-2" />}
            </div>
          ))}
        </div>
      </section>

      {/* Policy reference cards */}
      <section className="mb-14">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen size={18} className="text-green-400" />
          <h2 className="font-display text-xl font-bold">Policy Reference</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {POLICIES.map(p => (
            <div key={p.name} className="card p-5 hover:border-green-500/30 transition-all">
              <div className="flex items-start gap-3 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{p.area}</span>
                  </div>
                  <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed mb-2">{p.desc}</p>
                  <div className="border-l-2 border-green-500/30 pl-3">
                    <p className="text-xs text-green-300 italic">{p.peter}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* AI Q&A */}
      <div className="card p-6 border-green-500/20 bg-green-500/5 text-center">
        <Landmark size={28} className="text-green-400 mx-auto mb-3" />
        <h3 className="font-display text-lg font-bold mb-2">Ask About Federal Finance</h3>
        <p className="text-sm text-[hsl(var(--fg-muted))]">Use the chat widget to ask about OMB circulars, federal budgeting, appropriations law, or DoD-specific financial management.</p>
      </div>

      <AIChatWidget page="fed-finance" />
    </div>
  );
}
