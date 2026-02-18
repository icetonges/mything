import { LINKS } from "@/lib/constants";
import { 
  Brain, ExternalLink, Code, BookOpen, Lightbulb, TrendingUp, Award, 
  GitBranch, Check, X, Zap, Database, Cpu, FileText, Terminal, Play
} from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 3600;

// ML Algorithms Data
const ML_ALGORITHMS = [
  {
    name: "Linear Regression",
    category: "Supervised - Regression",
    emoji: "📈",
    concept: "Predicts continuous values by fitting a straight line (or hyperplane) through data points. Finds the best-fit line that minimizes the sum of squared differences between predicted and actual values.",
    useCases: [
      "DoD budget execution forecasting",
      "Predicting obligation rates based on historical trends",
      "Understanding relationships between budget variables",
      "Quick baseline model for any numeric prediction"
    ],
    advantages: [
      "Simple and interpretable - easy to explain to stakeholders",
      "Fast to train and predict - works well with large datasets",
      "Shows feature importance through coefficients",
      "Works well when relationship is actually linear"
    ],
    disadvantages: [
      "Assumes linear relationship - fails on complex patterns",
      "Sensitive to outliers",
      "Not suitable for classification problems",
      "Requires feature scaling for best results"
    ],
    code: `# DoD Budget Forecasting Example
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
print(f"R² Score: {r2_score(y_test, y_pred):.3f}")
print(f"MAE: ${mean_absolute_error(y_test, y_pred):,.0f}")

# Feature importance
for feat, coef in zip(X.columns, model.coef_):
    print(f"{feat}: {coef:+.2f}")`
  },
  {
    name: "Logistic Regression",
    category: "Supervised - Classification",
    emoji: "🎯",
    concept: "Predicts probability of binary outcomes (yes/no, 0/1) using sigmoid function to convert linear combination of features into probability between 0 and 1. Despite the name, it's for classification.",
    useCases: [
      "FIAR audit pass/fail prediction",
      "Contract award type classification (competitive vs sole-source)",
      "Employee turnover prediction",
      "Fraud detection in financial systems"
    ],
    advantages: [
      "Provides probability estimates, not just classifications",
      "Interpretable coefficients show feature impact",
      "Works well with linearly separable classes",
      "Regularization prevents overfitting"
    ],
    disadvantages: [
      "Assumes linear decision boundary",
      "Struggles with complex interactions",
      "Requires feature scaling",
      "Not ideal for multi-class without modification"
    ],
    code: `# FIAR Audit Risk Prediction
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler

# Features: control deficiencies, findings, complexity
X = df[['control_deficiencies', 'prior_findings', 'complexity_score']]
y = df['audit_failure']  # 1 = failed, 0 = passed

# Scale features (important!)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train with regularization
model = LogisticRegression(C=0.1, penalty='l2')
model.fit(X_scaled, y)

# Predictions with probability
probs = model.predict_proba(X_test)[:, 1]
preds = model.predict(X_test)

# Evaluation
from sklearn.metrics import classification_report, roc_auc_score
print(classification_report(y_test, preds))
print(f"AUC-ROC: {roc_auc_score(y_test, probs):.3f}")`
  },
  {
    name: "Random Forest",
    category: "Supervised - Ensemble",
    emoji: "🌲",
    concept: "Ensemble of decision trees where each tree votes on the prediction. Creates multiple trees using different random subsets of data and features, then aggregates their predictions. Majority vote for classification, average for regression.",
    useCases: [
      "Federal contract award prediction",
      "Budget risk assessment with mixed feature types",
      "Personnel action classification",
      "Any tabular data with complex interactions"
    ],
    advantages: [
      "Handles non-linear relationships naturally",
      "Works with mixed data types (numeric, categorical)",
      "Provides feature importance rankings",
      "Resistant to overfitting compared to single trees",
      "Robust to outliers and missing values"
    ],
    disadvantages: [
      "Slower to train than simpler models",
      "Large memory footprint with many trees",
      "Less interpretable than single decision tree",
      "Can overfit on noisy datasets if not tuned"
    ],
    code: `# Federal Contract Classification
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score

# Features: agency, NAICS, amount, set-aside type
X = pd.get_dummies(df[['agency', 'naics_code', 'amount', 'set_aside']])
y = df['award_type']  # 0 = competitive, 1 = sole-source

# Train with 100 trees
rf = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    min_samples_split=20,
    random_state=42
)

# Cross-validation
scores = cross_val_score(rf, X, y, cv=5, scoring='f1')
print(f"Cross-val F1: {scores.mean():.3f} (+/- {scores.std():.3f})")

# Feature importance
rf.fit(X_train, y_train)
importances = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)
print(importances.head(10))`
  },
  {
    name: "XGBoost",
    category: "Supervised - Gradient Boosting",
    emoji: "⚡",
    concept: "Advanced gradient boosting that builds trees sequentially, where each new tree corrects errors of previous trees. Uses gradient descent optimization and regularization to prevent overfitting. State-of-the-art for structured data.",
    useCases: [
      "DoD budget execution prediction",
      "Complex financial forecasting",
      "Kaggle competitions (most winning solution)",
      "Any structured/tabular data problem"
    ],
    advantages: [
      "Best performance on structured data",
      "Handles missing values automatically",
      "Built-in regularization prevents overfitting",
      "Feature importance and SHAP values available",
      "Parallel processing for speed"
    ],
    disadvantages: [
      "Many hyperparameters to tune",
      "Longer training time than Random Forest",
      "Requires careful tuning to avoid overfitting",
      "Less interpretable than linear models"
    ],
    code: `# DoD Budget Execution Forecasting
import xgboost as xgb
from sklearn.model_selection import GridSearchCV

# Prepare data
dtrain = xgb.DMatrix(X_train, label=y_train)
dtest = xgb.DMatrix(X_test, label=y_test)

# Hyperparameter tuning
params = {
    'max_depth': [3, 5, 7],
    'learning_rate': [0.01, 0.1, 0.3],
    'n_estimators': [100, 200, 300],
    'subsample': [0.8, 1.0]
}

xgb_model = xgb.XGBRegressor(objective='reg:squarederror')
grid = GridSearchCV(xgb_model, params, cv=5, scoring='neg_mean_absolute_error')
grid.fit(X_train, y_train)

# Best model
best_model = grid.best_estimator_
y_pred = best_model.predict(X_test)

# Feature importance
import matplotlib.pyplot as plt
xgb.plot_importance(best_model, max_num_features=10)
plt.show()`
  },
  {
    name: "K-Means Clustering",
    category: "Unsupervised - Clustering",
    emoji: "🔵",
    concept: "Groups data into K clusters by iteratively assigning points to nearest centroid and updating centroids. Unsupervised learning - no labels needed. Finds natural groupings in data.",
    useCases: [
      "Grouping federal agencies by spending patterns",
      "Customer segmentation",
      "Anomaly detection (outliers from clusters)",
      "Document categorization"
    ],
    advantages: [
      "Simple and fast algorithm",
      "Scales well to large datasets",
      "Works well with spherical clusters",
      "Easy to implement and understand"
    ],
    disadvantages: [
      "Must specify K (number of clusters) in advance",
      "Sensitive to initial centroid placement",
      "Assumes clusters are spherical and similar size",
      "Sensitive to outliers and scale"
    ],
    code: `# Agency Spending Pattern Clustering
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# Features: budget size, execution rate, variance
X = df[['total_budget', 'execution_rate', 'variance_score']]

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Determine optimal K using elbow method
inertias = []
for k in range(2, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# Train with optimal K
kmeans = KMeans(n_clusters=4, random_state=42)
clusters = kmeans.fit_predict(X_scaled)

# Analyze clusters
df['cluster'] = clusters
print(df.groupby('cluster').mean())`
  },
  {
    name: "Neural Networks",
    category: "Deep Learning",
    emoji: "🧠",
    concept: "Layered network of artificial neurons that learn complex patterns through backpropagation. Each layer transforms input through weighted connections. Can approximate any function with enough neurons and data.",
    useCases: [
      "Complex pattern recognition",
      "Image classification",
      "Natural language processing",
      "Time series forecasting with deep features"
    ],
    advantages: [
      "Can learn extremely complex patterns",
      "Works with unstructured data (images, text)",
      "Automatic feature learning",
      "Transfer learning from pre-trained models"
    ],
    disadvantages: [
      "Requires large amounts of data",
      "Slow to train, needs GPUs",
      "Black box - hard to interpret",
      "Many hyperparameters to tune",
      "Can easily overfit"
    ],
    code: `# Simple Neural Network for Classification
from tensorflow import keras
from tensorflow.keras import layers

# Build model
model = keras.Sequential([
    layers.Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    layers.Dropout(0.3),
    layers.Dense(32, activation='relu'),
    layers.Dropout(0.3),
    layers.Dense(1, activation='sigmoid')
])

# Compile
model.compile(
    optimizer='adam',
    loss='binary_crossentropy',
    metrics=['accuracy', 'AUC']
)

# Train
history = model.fit(
    X_train, y_train,
    validation_data=(X_val, y_val),
    epochs=50,
    batch_size=32,
    callbacks=[keras.callbacks.EarlyStopping(patience=5)]
)

# Evaluate
test_loss, test_acc, test_auc = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {test_acc:.3f}, AUC: {test_auc:.3f}")`
  }
];

// Kaggle Whitepapers
const KAGGLE_WHITEPAPERS = [
  {
    title: "Introduction to Agents",
    url: "https://www.kaggle.com/whitepaper-introduction-to-agents",
    summary: "Foundational concepts of AI agents: what they are, how they work, and why they matter. Covers agent architecture, reasoning loops, and basic implementation patterns.",
    topics: ["Agent definition", "ReAct pattern", "Agent loops", "When to use agents"]
  },
  {
    title: "Agent Tools & Interoperability with MCP",
    url: "https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp",
    summary: "Deep dive into tool use and Model Context Protocol (MCP). How agents interact with external systems, databases, and APIs.",
    topics: ["Function calling", "MCP protocol", "Tool design", "Interoperability"]
  },
  {
    title: "Context Engineering, Sessions & Memory",
    url: "https://www.kaggle.com/whitepaper-context-engineering-sessions-and-memory",
    summary: "Managing context windows, conversation history, and agent memory. Techniques for long-running sessions and state management.",
    topics: ["Context management", "Session handling", "Memory patterns", "State persistence"]
  },
  {
    title: "Agent Quality",
    url: "https://www.kaggle.com/whitepaper-agent-quality",
    summary: "Testing, evaluating, and improving agent performance. Metrics, benchmarks, and quality assurance for production agents.",
    topics: ["Evaluation metrics", "Testing strategies", "Quality assurance", "Performance monitoring"]
  },
  {
    title: "Prototype to Production",
    url: "https://www.kaggle.com/whitepaper-prototype-to-production",
    summary: "Taking agents from experimentation to production deployment. Infrastructure, scaling, monitoring, and best practices.",
    topics: ["Production deployment", "Scaling", "Monitoring", "Best practices"]
  }
];

export default function AIMLPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--bg))] to-[hsl(var(--bg-muted))]">
      {/* Hero Section */}
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
                Complete guide to ML algorithms, AI agents, and production systems — from fundamentals to deployment
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3">
            <a href="#ml-algorithms" className="flex items-center gap-2 px-5 py-3 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
              ML Algorithms <BookOpen size={16} />
            </a>
            <a href="#ai-agents" className="flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-500/30 bg-purple-500/10 font-semibold text-sm hover:border-purple-500/50 transition-all">
              AI Agents Guide <GitBranch size={16} />
            </a>
            <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
              My Kaggle <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Section 1: ML Algorithms */}
        <section id="ml-algorithms">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Code size={20} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">Machine Learning Algorithms</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Core algorithms with real-world DoD/federal use cases</p>
            </div>
          </div>

          <div className="space-y-6">
            {ML_ALGORITHMS.map((algo, idx) => (
              <div key={idx} className="card p-6 border-purple-500/20 hover:border-purple-500/40 transition-all">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-4xl">{algo.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-display text-2xl font-bold">{algo.name}</h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300">
                        {algo.category}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                      {algo.concept}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Use Cases */}
                  <div>
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-blue-400">
                      <Lightbulb size={16} />
                      Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {algo.useCases.map((uc, i) => (
                        <li key={i} className="text-xs text-[hsl(var(--fg-muted))] flex items-start gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>
                          <span>{uc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-400">
                        <Check size={16} />
                        Advantages
                      </h4>
                      <ul className="space-y-1">
                        {algo.advantages.map((adv, i) => (
                          <li key={i} className="text-xs text-[hsl(var(--fg-muted))]">• {adv}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-orange-400">
                        <X size={16} />
                        Disadvantages
                      </h4>
                      <ul className="space-y-1">
                        {algo.disadvantages.map((dis, i) => (
                          <li key={i} className="text-xs text-[hsl(var(--fg-muted))]">• {dis}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Code Example */}
                <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                  <div className="px-4 py-2 border-b border-[hsl(var(--border))] flex items-center justify-between">
                    <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python</span>
                    <Terminal size={12} className="text-[hsl(var(--fg-muted))]" />
                  </div>
                  <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed">
{algo.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: AI Agents */}
        <section id="ai-agents">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <GitBranch size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-3xl font-bold">AI Agents: From Concept to Production</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Based on Kaggle AI Agents Intensive & Google whitepapers</p>
            </div>
          </div>

          {/* Quick Implementation */}
          <div className="card p-6 mb-8 border-green-500/20 bg-green-500/5">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <Zap size={20} className="text-green-400" />
              Quick Implementation Guide
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">1️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Define Tools</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Create functions the agent can call: search databases, fetch data, send emails, etc.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">2️⃣</div>
                <h4 className="font-semibold text-sm mb-2">System Prompt</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Give agent context: who it is, what it knows, when to use tools, how to respond.
                </p>
              </div>
              <div className="p-4 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-2xl mb-2">3️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Agentic Loop</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Let agent decide: call tool → get result → reason → repeat or answer.
                </p>
              </div>
            </div>

            {/* Implementation Code */}
            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">typescript — my-agent.ts</span>
              </div>
              <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">
{`import { GoogleGenerativeAI } from '@google/genai';

// 1. Define Tools
const tools = [
  {
    name: "search_database",
    description: "Search DoD budget database for obligations",
    parameters: {
      type: "object",
      properties: {
        account: { type: "string", description: "Appropriation account" },
        fiscal_year: { type: "number" }
      }
    }
  }
];

// 2. System Prompt
const systemPrompt = \`You are a DoD financial analyst assistant.
You help users analyze budget data and answer questions about obligations.
Use search_database tool when users ask about specific accounts.\`;

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

  // Loop: if agent calls tool, execute and continue
  while (response.functionCalls && response.functionCalls.length > 0) {
    const toolResults = [];
    for (const fc of response.functionCalls) {
      // Execute tool
      const result = await executeFunction(fc.name, fc.args);
      toolResults.push({
        functionResponse: { name: fc.name, response: result }
      });
    }
    response = await chat.sendMessage({ message: toolResults });
  }

  return response.text;
}

// Tool executor
async function executeFunction(name: string, args: any) {
  if (name === 'search_database') {
    // Query database with args.account, args.fiscal_year
    return { obligations: 1234567, account: args.account };
  }
}`}
              </pre>
            </div>
          </div>

          {/* Kaggle Whitepapers */}
          <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
            <FileText size={20} className="text-blue-400" />
            Kaggle AI Agents Whitepapers
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {KAGGLE_WHITEPAPERS.map((paper, idx) => (
              <a 
                key={idx}
                href={paper.url}
                target="_blank"
                rel="noopener noreferrer"
                className="card p-5 border-blue-500/20 hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    {paper.title}
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0 ml-2" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))] mb-3 leading-relaxed">
                  {paper.summary}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {paper.topics.map((topic, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[10px] text-blue-300">
                      {topic}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>

          {/* My Production Agent */}
          <div className="card p-6 border-purple-500/20 bg-purple-500/5">
            <h3 className="font-display text-xl font-bold mb-4">My Production Agent: MyThing Platform</h3>
            <p className="text-sm text-[hsl(var(--fg-muted))] mb-4">
              Live multi-agent system with 4 specialized agents, 5 tools, and intelligent routing. 
              Powers 500+ daily interactions on this site.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-sm mb-3 text-purple-400">Agent Architecture</h4>
                <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                  <li>• <strong>Portfolio Agent</strong> - Background, skills, certifications</li>
                  <li>• <strong>Tech Trends Agent</strong> - Latest AI/ML news from 22 sources</li>
                  <li>• <strong>DoD Policy Agent</strong> - Budget, audit, IT policy expert</li>
                  <li>• <strong>Notes Agent</strong> - Capture & analyze thoughts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3 text-green-400">Tool Capabilities</h4>
                <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                  <li>• <strong>search_tech_articles</strong> - Query 500+ AI/ML articles</li>
                  <li>• <strong>get_platform_stats</strong> - Real-time system metrics</li>
                  <li>• <strong>save_note</strong> - Store thoughts with AI analysis</li>
                  <li>• <strong>get_recent_notes</strong> - Retrieve past insights</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-[hsl(var(--bg-muted))] border border-purple-500/20">
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                <strong className="text-purple-400">Key Insight:</strong> Routing happens automatically based on message keywords. 
                "Tell me about your background" → Portfolio Agent. "Latest AI news?" → Tech Trends Agent. 
                "DoD budget execution" → DoD Policy Agent. Users get expert responses without manual selection.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Certifications */}
        <section id="certifications">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
              <Award size={20} className="text-orange-400" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold">Certifications & Training</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Formal education backing this knowledge</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 border-purple-500/20 bg-purple-500/5">
              <div className="text-3xl mb-3">🏅</div>
              <h3 className="font-semibold mb-1">Google/Kaggle AI Agents Intensive</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Nov 2025 • 5-day intensive</p>
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                Agentic AI, function calling, RAG, multi-agent orchestration — applied to MyThing platform
              </p>
            </div>
            <div className="card p-5 border-blue-500/20 bg-blue-500/5">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-semibold mb-1">IBM Data Science Professional</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">2024 • 10 courses</p>
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                Python, ML (scikit-learn, XGBoost), SQL, visualization — applied to DoD budget forecasting
              </p>
            </div>
            <div className="card p-5 border-green-500/20 bg-green-500/5">
              <div className="text-3xl mb-3">🏛️</div>
              <h3 className="font-semibold mb-1">CDFM (Defense Financial Manager)</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Active certification</p>
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                Federal budget, accounting, audit readiness — 12+ years DoD financial management
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <div className="card p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center">
          <Brain size={40} className="text-purple-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-3">Ask My AI Agent</h3>
          <p className="text-sm text-[hsl(var(--fg-muted))] mb-6 max-w-2xl mx-auto">
            Use the chat widget to ask questions about ML algorithms, AI agents, or how I apply these 
            techniques to federal finance. The agent will route your question to the right specialist.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-xs">💼 Portfolio</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-xs">🚀 Tech Trends</span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-xs">🏛️ DoD Policy</span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-xs">📝 Notes</span>
          </div>
        </div>
      </div>

      <AIChatWidget page="ai-ml" />
    </div>
  );
}
