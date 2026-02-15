import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FedFinanceQA } from '@/components/ai/FedFinanceQA';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

const POLICIES = [
  { name: 'OMB A-11', desc: 'Preparation and submission of the federal budget', application: 'Budget formulation, justification, and execution reporting.' },
  { name: 'OMB A-123', desc: 'Management’s responsibility for internal control', application: 'Internal controls and risk assessment.' },
  { name: 'OMB A-136', desc: 'Financial reporting requirements for the federal government', application: 'Financial reporting and audit compliance.' },
  { name: 'CFO Act', desc: 'Chief Financial Officers Act — federal financial management', application: 'CFO structure and financial systems.' },
  { name: 'GPRA', desc: 'Government Performance and Results Act', application: 'Strategic planning and performance measurement.' },
  { name: 'FASAB', desc: 'Federal Accounting Standards Advisory Board', application: 'Federal accounting standards and SFFAC.' },
];

export default function FedFinancePage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <AIChatWidget />
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">Federal Finance</h1>
        <p className="text-muted-foreground mb-8">Federal budget and financial management expertise</p>

        <section className="mb-12">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Overview</h2>
              <p className="text-muted-foreground">
                GS-15 Pentagon role, $338B portfolio, 15+ years in federal financial management. DoD OIG, U.S. Army experience.
              </p>
            </CardHeader>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Policy Reference</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {POLICIES.map((p) => (
              <Card key={p.name}>
                <CardHeader>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                  <p className="text-sm mt-2">Application: {p.application}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Budget Process</h2>
          <Card>
            <CardContent className="py-6">
              <div className="flex flex-wrap gap-2 justify-center text-sm">
                <span className="rounded bg-muted px-3 py-1">Formulation</span>
                <span>→</span>
                <span className="rounded bg-muted px-3 py-1">President&apos;s Budget</span>
                <span>→</span>
                <span className="rounded bg-muted px-3 py-1">Congressional Action</span>
                <span>→</span>
                <span className="rounded bg-muted px-3 py-1">Enactment</span>
                <span>→</span>
                <span className="rounded bg-muted px-3 py-1">Execution</span>
                <span>→</span>
                <span className="rounded bg-muted px-3 py-1">Audit</span>
              </div>
              <p className="text-center text-muted-foreground mt-4 text-sm">
                Federal budget lifecycle — interactive diagram can be enhanced with a visual component.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">AI Q&A — Federal Budget</h2>
          <Card>
            <CardContent className="py-6">
              <FedFinanceQA page="fed-finance" placeholder="Ask any federal budget question…" />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
