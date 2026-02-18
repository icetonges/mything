import { LINKS } from "@/lib/constants";
import { 
  Brain, ExternalLink, Code, BookOpen, Lightbulb, GitBranch, Check, X, Zap, Terminal, FileText
} from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 3600;

export default function AIMLPage() {
  // Code examples stored as plain strings (no template literals with $)
  const linearCode = `# DoD Budget Forecasting Example
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import pandas as pd

# Load DoD obligation data
df = pd.read_csv('dod_obligations.csv')
X = df[['days_into_fy', 'prior_year_pace', 'appropriation_amt']]
y = df['obligations_to_date']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Evaluate
from sklearn.metrics import r2_score, mean_absolute_error
y_pred = model.predict(X_test)
print("R² Score:", r2_score(y_test, y_pred))
print("MAE:", mean_absolute_error(y_test, y_pred))`;

  const logisticCode = `# FIAR Audit Risk Prediction
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Features: control deficiencies, findings, complexity
X = df[['control_deficiencies', 'prior_findings', 'complexity_score']]
y = df['audit_failure']  # 1 = failed, 0 = passed

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train with regularization
model = LogisticRegression(C=0.1, penalty='l2')
model.fit(X_scaled, y)

# Predictions
probs = model.predict_proba(X_test)[:, 1]
preds = model.predict(X_test)`;

  const randomForestCode = `# Federal Contract Classification
from sklearn.ensemble import RandomForestClassifier

# Features
X = pd.get_dummies(df[['agency', 'naics_code', 'amount']])
y = df['award_type']

# Train
rf = RandomForestClassifier(n_estimators=100, max_depth=10)
rf.fit(X_train, y_train)

# Feature importance
importances = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)`;

  const agentCode = `import { GoogleGenerativeAI } from '@google/genai';

// 1. Define Tools
const tools = [{
  name: "search_database",
  description: "Search DoD budget database",
  parameters: { 
    type: "object", 
    properties: { account: { type: "string" }}
  }
}];

// 2. System Prompt
const systemPrompt = 'You are a DoD financial analyst assistant.';

// 3. Agentic Loop
async function runAgent(userMessage: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    tools: tools
  });

  const chat = model.startChat();
  let response = await chat.sendMessage({ message: userMessage });

  // Loop while agent calls tools
  while (response.functionCalls?.length > 0) {
    const results = [];
    for (const fc of response.functionCalls) {
      const result = await executeFunction(fc.name, fc.args);
      results.push({ 
        functionResponse: { name: fc.name, response: result }
      });
    }
    response = await chat.sendMessage({ message: results });
  }
  return response.text;
}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--bg))] to-[hsl(var(--bg-muted))]">
      {/* Hero */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI & Machine Learning Knowledge Hub
              </h1>
              <p className="text-lg text-[hsl(var(--fg-muted))] max-w-3xl">
                Complete guide to ML algorithms, AI agents, and production systems
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href="#ml-algorithms" className="flex items-center gap-2 px-5 py-3 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
              ML Algorithms <BookOpen size={16} />
            </a>
            <a href="#ai-agents" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 font-semibold text-sm hover:border-purple-500/50 transition-all">
              AI Agents <GitBranch size={16} />
            </a>
            <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
              Kaggle <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* ML Algorithms */}
        <section id="ml-algorithms">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Code size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">Machine Learning Algorithms</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Core algorithms with DoD/federal use cases</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Linear Regression */}
            <div className="card p-6 border-purple-500/20">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">📈</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl font-bold">Linear Regression</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300">
                      Supervised - Regression
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">
                    Predicts continuous values by fitting a straight line through data points.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• DoD budget execution forecasting</li>
                    <li>• Predicting obligation rates</li>
                    <li>• Understanding feature relationships</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Simple and interpretable</li>
                      <li>• Fast to train and predict</li>
                      <li>• Shows feature importance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Assumes linear relationships</li>
                      <li>• Sensitive to outliers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))] flex items-center justify-between">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python</span>
                  <Terminal size={12} className="text-[hsl(var(--fg-muted))]" />
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{linearCode}</pre>
              </div>
            </div>

            {/* Logistic Regression */}
            <div className="card p-6 border-purple-500/20">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🎯</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl font-bold">Logistic Regression</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300">
                      Classification
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">
                    Predicts probability of binary outcomes. Despite the name, it's for classification.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• FIAR audit risk prediction</li>
                    <li>• Contract award classification</li>
                    <li>• Employee turnover prediction</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Provides probability estimates</li>
                      <li>• Interpretable coefficients</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Linear decision boundary</li>
                      <li>• Requires feature scaling</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{logisticCode}</pre>
              </div>
            </div>

            {/* Random Forest */}
            <div className="card p-6 border-purple-500/20">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">🌲</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl font-bold">Random Forest</h3>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                      Ensemble
                    </span>
                  </div>
                  <p className="text-sm text-[hsl(var(--fg-muted))]">
                    Ensemble of decision trees. Handles non-linear relationships naturally.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Federal contract classification</li>
                    <li>• Budget risk assessment</li>
                    <li>• Complex tabular data</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Handles non-linear patterns</li>
                      <li>• Feature importance built-in</li>
                      <li>• Robust to outliers</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>• Slower to train</li>
                      <li>• Less interpretable</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{randomForestCode}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* AI Agents */}
        <section id="ai-agents">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <GitBranch size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">AI Agents: Concept to Production</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Based on Kaggle AI Agents Intensive</p>
            </div>
          </div>

          <div className="card p-6 mb-8 border-green-500/20 bg-green-500/5">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Zap size={20} className="text-green-400" />
              Quick Implementation
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Define Tools</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Functions the agent can call
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-semibold text-sm mb-2">System Prompt</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Agent context and personality
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Agentic Loop</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Tool → Result → Reason → Repeat
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">typescript</span>
              </div>
              <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{agentCode}</pre>
            </div>
          </div>

          {/* Kaggle Whitepapers */}
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            Kaggle Whitepapers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="https://www.kaggle.com/whitepaper-introduction-to-agents" target="_blank" rel="noopener noreferrer" className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm group-hover:text-blue-400">Introduction to Agents</h4>
                <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
              </div>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Foundational concepts: what agents are and how they work</p>
            </a>

            <a href="https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp" target="_blank" rel="noopener noreferrer" className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm group-hover:text-blue-400">Agent Tools & MCP</h4>
                <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
              </div>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Tool use and Model Context Protocol</p>
            </a>

            <a href="https://www.kaggle.com/whitepaper-context-engineering-sessions-and-memory" target="_blank" rel="noopener noreferrer" className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm group-hover:text-blue-400">Context & Memory</h4>
                <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
              </div>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Managing context windows and agent memory</p>
            </a>

            <a href="https://www.kaggle.com/whitepaper-agent-quality" target="_blank" rel="noopener noreferrer" className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm group-hover:text-blue-400">Agent Quality</h4>
                <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
              </div>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Testing and improving agent performance</p>
            </a>

            <a href="https://www.kaggle.com/whitepaper-prototype-to-production" target="_blank" rel="noopener noreferrer" className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-sm group-hover:text-blue-400">Prototype to Production</h4>
                <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
              </div>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Production deployment and scaling</p>
            </a>
          </div>
        </section>

        {/* CTA */}
        <div className="card p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center">
          <Brain size={40} className="text-purple-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-3">Ask My AI Agent</h3>
          <p className="text-sm text-[hsl(var(--fg-muted))] max-w-2xl mx-auto">
            Use the chat widget to ask about ML algorithms, AI agents, or federal finance applications.
          </p>
        </div>
      </div>

      <AIChatWidget page="ai-ml" />
    </div>
  );
}
