import Link from 'next/link';
import { LINKS } from '@/lib/constants';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FedFinanceQA } from '@/components/ai/FedFinanceQA';
import { AIChatWidget } from '@/components/ai/AIChatWidget';

// Reuse FedFinanceQA pattern for AI concepts - inline Q&A
function AIConceptsQA() {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold">AI Concepts — Ask anything</h3>
        <p className="text-sm text-muted-foreground">Powered by Gemini. Ask about ML, Kaggle, or current AI trends.</p>
      </CardHeader>
      <CardContent>
        <FedFinanceQA page="ai-ml" placeholder="e.g. What is gradient boosting?" />
      </CardContent>
    </Card>
  );
}

export default function AIMLPage() {
  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <AIChatWidget />
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-3xl font-bold mb-2">AI & ML</h1>
        <p className="text-muted-foreground mb-8">Knowledge, experiments, Kaggle, and trends</p>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Kaggle Notebooks</h2>
          <Card>
            <CardContent className="py-6">
              <p className="text-muted-foreground mb-4">
                Explore notebooks on data science, ML, and AI at Kaggle.
              </p>
              <a
                href={LINKS.kaggle}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                kaggle.com/icetonges →
              </a>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">AI Concepts Explainer</h2>
          <AIConceptsQA />
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Courses & Certifications</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>IBM Data Science Professional Certificate</li>
            <li>Google / Kaggle AI Agents Intensive</li>
            <li>Relevant DS coursework (DS599–DS670)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Code Snippets</h2>
          <Card>
            <CardContent className="py-6">
              <pre className="text-sm font-mono bg-muted p-4 rounded-lg overflow-x-auto">
{`# Simple sklearn pipeline example
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

pipe = Pipeline([
    ("scaler", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
pipe.fit(X_train, y_train)
score = pipe.score(X_test, y_test)`}
              </pre>
              <p className="text-sm text-muted-foreground mt-2">
                Python/JS examples with explanations can be expanded here.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
