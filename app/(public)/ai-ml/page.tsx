import { LINKS } from "@/lib/constants";
import { Brain, ExternalLink, Code, BookOpen, Lightbulb, GitBranch, Check, X, AlertCircle, Terminal, FileText, TrendingUp, Zap, ArrowUp } from "lucide-react";
import AIChatWidget from "@/components/ai/AIChatWidget";

export const revalidate = 3600;

export default function AIMLPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[hsl(var(--bg))] to-[hsl(var(--bg-muted))]">
      {/* Floating Quick Nav */}
      <div className="fixed bottom-24 right-6 z-40 flex flex-col gap-2">
        <a href="#top" className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors shadow-lg" title="Back to top">
          <ArrowUp size={20} className="text-white" />
        </a>
        <a href="#ml-section" className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 transition-colors shadow-lg" title="Jump to ML">
          <Code size={20} className="text-white" />
        </a>
        <a href="#ai-section" className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors shadow-lg" title="Jump to AI">
          <GitBranch size={20} className="text-white" />
        </a>
      </div>

      {/* Hero */}
      <div id="top" className="border-b border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
              <Brain size={32} className="text-purple-400" />
            </div>
            <div>
              <h1 className="font-display text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                AI & ML Comprehensive Knowledge Hub
              </h1>
              <p className="text-lg text-[hsl(var(--fg-muted))] max-w-3xl">
                Complete reference: ML algorithms, evaluation metrics, clustering, AI agents, and real-world DoD applications
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a href="#ml-section" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl gold-bg font-semibold text-sm hover:opacity-90 transition-opacity">
              <Code size={16} />ML Algorithms
            </a>
            <a href="#clustering" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-blue-500/30 bg-blue-500/10 font-semibold text-sm hover:border-blue-500/50 transition-all">
              <TrendingUp size={16} />Clustering
            </a>
            <a href="#ai-section" className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-green-500/30 bg-green-500/10 font-semibold text-sm hover:border-green-500/50 transition-all">
              <GitBranch size={16} />AI Agents
            </a>
            <a href={LINKS.kaggle} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-[hsl(var(--border))] font-semibold text-sm hover:border-[hsl(var(--accent)/0.4)] transition-all">
              <ExternalLink size={14} />Kaggle
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Quick Overview */}
        <section>
          <h2 className="font-display text-3xl font-bold mb-6">Machine Learning Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-5 border-green-500/20 bg-green-500/5">
              <h3 className="font-semibold mb-2 text-green-400">Supervised Learning</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Learn from labeled data</p>
              <ul className="text-xs text-[hsl(var(--fg-muted))] space-y-1">
                <li>• Classification: Categories</li>
                <li>• Regression: Continuous values</li>
              </ul>
            </div>

            <div className="card p-5 border-blue-500/20 bg-blue-500/5">
              <h3 className="font-semibold mb-2 text-blue-400">Unsupervised Learning</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Find patterns in data</p>
              <ul className="text-xs text-[hsl(var(--fg-muted))] space-y-1">
                <li>• Clustering: Grouping</li>
                <li>• Dimensionality reduction</li>
              </ul>
            </div>

            <div className="card p-5 border-purple-500/20 bg-purple-500/5">
              <h3 className="font-semibold mb-2 text-purple-400">Reinforcement Learning</h3>
              <p className="text-xs text-[hsl(var(--fg-muted))] mb-3">Learn through rewards</p>
              <ul className="text-xs text-[hsl(var(--fg-muted))] space-y-1">
                <li>• Agent takes actions</li>
                <li>• Receives feedback</li>
              </ul>
            </div>
          </div>

          {/* Evaluation Metrics */}
          <div className="card p-6 mb-8">
            <h3 className="font-semibold text-xl mb-4">Evaluation Metrics Guide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-green-400">Classification</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">Accuracy:</strong> (TP+TN)/Total
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Use only with balanced classes</p>
                  </div>
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">Precision:</strong> TP/(TP+FP)
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Of predicted positives, how many correct?</p>
                  </div>
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">Recall:</strong> TP/(TP+FN)
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Of actual positives, how many caught?</p>
                  </div>
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">F1 Score:</strong> Harmonic mean of P&R
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Balance precision and recall</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-blue-400">Regression</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">MAE:</strong> Mean Absolute Error
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Average absolute difference</p>
                  </div>
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">RMSE:</strong> Root Mean Squared Error
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Penalizes large errors more</p>
                  </div>
                  <div className="p-3 rounded bg-[hsl(var(--bg-muted))]">
                    <strong className="text-white">R²:</strong> Coefficient of determination
                    <p className="text-[hsl(var(--fg-muted))] mt-1">Variance explained (0-1)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-orange-500/30 bg-orange-500/5">
              <div className="flex items-start gap-2">
                <AlertCircle size={16} className="text-orange-400 mt-0.5 shrink-0" />
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  <strong className="text-orange-400">Key Insight:</strong> With imbalanced data (e.g., 99% negative class), 
                  accuracy is misleading. Always use Precision, Recall, F1, and AUC-ROC for imbalanced datasets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ML ALGORITHMS SECTION */}
        <section id="ml-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Code size={24} className="text-purple-400" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold">Classification Algorithms</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Supervised learning for categorical predictions</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Logistic Regression */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">🎯</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">Logistic Regression</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Binary classifier using sigmoid function to map outputs to [0,1] probability range. 
                    Linear model suitable for linearly separable problems.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />DoD/Federal Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• FIAR audit pass/fail prediction</li>
                    <li>• Medical diagnosis classification</li>
                    <li>• Email spam/ham filtering</li>
                    <li>• Credit approval decisions</li>
                    <li>• Fraud detection in transactions</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Provides calibrated probability scores</li>
                      <li>✓ Interpretable coefficients (feature importance)</li>
                      <li>✓ Fast training and prediction</li>
                      <li>✓ Low computational requirements</li>
                      <li>✓ Works well with high-dimensional data</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Assumes linear decision boundary</li>
                      <li>✗ Requires feature scaling for optimal performance</li>
                      <li>✗ Cannot capture complex feature interactions</li>
                      <li>✗ Sensitive to multicollinearity</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))] flex items-center justify-between">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - FIAR Audit Risk Prediction</span>
                  <Terminal size={12} className="text-[hsl(var(--fg-muted))]" />
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score

# Load audit data
X = df[['control_deficiencies', 'prior_findings', 'complexity_score']]
y = df['audit_failure']  # 1=failed, 0=passed

# CRITICAL: Feature scaling for logistic regression
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Train with L2 regularization
model = LogisticRegression(
    C=0.1,              # Regularization strength (inverse)
    penalty='l2',       # L2 regularization
    max_iter=1000,
    solver='lbfgs',
    random_state=42
)

# Cross-validation for robust evaluation
cv_scores = cross_val_score(model, X_scaled, y, cv=5, scoring='f1')
print(f"CV F1 Score: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

# Train final model
model.fit(X_scaled, y)

# Predictions with probability
y_pred_proba = model.predict_proba(X_test_scaled)[:, 1]
y_pred = model.predict(X_test_scaled)

# Comprehensive evaluation
from sklearn.metrics import classification_report, roc_auc_score
print(classification_report(y_test, y_pred))
print(f"AUC-ROC: {roc_auc_score(y_test, y_pred_proba):.3f}")`}</pre>
              </div>
            </div>

            {/* SVM */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">⚡</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">Support Vector Machine (SVM)</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Finds optimal hyperplane maximizing margin between classes. Kernel trick enables non-linear 
                    classification. Effective in high-dimensional spaces.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Text classification (high-dimensional)</li>
                    <li>• Image recognition and computer vision</li>
                    <li>• Bioinformatics (gene classification)</li>
                    <li>• Handwriting recognition</li>
                    <li>• Face detection</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Effective in high-dimensional spaces</li>
                      <li>✓ Memory efficient (uses support vectors only)</li>
                      <li>✓ Versatile (multiple kernel functions)</li>
                      <li>✓ Strong with clear margin of separation</li>
                      <li>✓ Robust to overfitting in high dimensions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Slow on large datasets (O(n²) to O(n³))</li>
                      <li>✗ Sensitive to feature scaling</li>
                      <li>✗ No direct probability estimates</li>
                      <li>✗ Difficult to interpret (black box)</li>
                      <li>✗ Choice of kernel requires domain knowledge</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - SVM with RBF Kernel</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.svm import SVC
from sklearn.preprocessing import StandardScaler

# Feature scaling is CRITICAL for SVM
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# RBF kernel for non-linear classification
svm = SVC(
    kernel='rbf',           # Radial Basis Function
    C=1.0,                  # Regularization parameter
    gamma='scale',          # Kernel coefficient (auto-tuned)
    probability=True,       # Enable probability estimates
    random_state=42
)

# Train
svm.fit(X_train_scaled, y_train)

# Predict
y_pred = svm.predict(X_test_scaled)
y_proba = svm.predict_proba(X_test_scaled)

# Model info
print(f"Support vectors: {svm.n_support_}")
print(f"Classes: {svm.classes_}")

# Evaluate
from sklearn.metrics import accuracy_score, confusion_matrix
print(f"Accuracy: {accuracy_score(y_test, y_pred):.3f}")
print(confusion_matrix(y_test, y_pred))`}</pre>
              </div>
            </div>

            {/* Random Forest */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">🌲</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">Random Forest</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Ensemble method combining multiple decision trees through bootstrap aggregating (bagging). 
                    Each tree votes; majority wins. Reduces overfitting through randomization.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Federal contract award classification</li>
                    <li>• Credit risk assessment</li>
                    <li>• Customer churn prediction</li>
                    <li>• Disease diagnosis (medical)</li>
                    <li>• Stock market prediction</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Handles non-linear relationships naturally</li>
                      <li>✓ Robust to outliers and noise</li>
                      <li>✓ Provides feature importance rankings</li>
                      <li>✓ No feature scaling required</li>
                      <li>✓ Works with mixed data types</li>
                      <li>✓ Parallel training possible</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Slower than single decision tree</li>
                      <li>✗ Large memory footprint (stores all trees)</li>
                      <li>✗ Less interpretable than single tree</li>
                      <li>✗ Can overfit on noisy data</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - Federal Contract Classification</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
import pandas as pd

# Prepare features (categorical encoding)
X = pd.get_dummies(df[['agency', 'naics_code', 'amount', 'location']])
y = df['award_type']  # 0=competitive, 1=sole-source

# Train Random Forest
rf = RandomForestClassifier(
    n_estimators=100,       # Number of trees
    max_depth=10,           # Prevent overfitting
    min_samples_split=20,   # Minimum samples to split
    min_samples_leaf=10,    # Minimum samples per leaf
    max_features='sqrt',    # Features per split
    random_state=42,
    n_jobs=-1               # Use all CPU cores
)

# Cross-validation
cv_scores = cross_val_score(rf, X, y, cv=5, scoring='f1')
print(f"CV F1: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

# Train final model
rf.fit(X_train, y_train)

# Feature importance analysis
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': rf.feature_importances_
}).sort_values('importance', ascending=False)

print("Top 10 Most Important Features:")
print(feature_importance.head(10))

# Predictions
y_pred = rf.predict(X_test)
y_proba = rf.predict_proba(X_test)

# Evaluate
from sklearn.metrics import classification_report
print(classification_report(y_test, y_pred))`}</pre>
              </div>
            </div>

            {/* SGD Classifier */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">⚙️</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">SGD Classifier</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Stochastic Gradient Descent for large-scale learning. Updates model incrementally using 
                    one sample at a time. Efficient for massive datasets and online learning.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Large-scale text classification</li>
                    <li>• Online learning (streaming data)</li>
                    <li>• Real-time prediction systems</li>
                    <li>• Datasets too large for memory</li>
                  </ul>

                  <div className="mt-4 p-3 rounded bg-purple-500/10 border border-purple-500/30">
                    <p className="text-xs font-semibold mb-2 text-purple-300">Loss Functions:</p>
                    <ul className="text-[10px] text-[hsl(var(--fg-muted))] space-y-1">
                      <li>• "hinge" → SVM (max margin)</li>
                      <li>• "log_loss" → Logistic Regression</li>
                      <li>• "perceptron" → Perceptron</li>
                      <li>• "squared_error" → Linear Regression</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Extremely efficient on large datasets</li>
                      <li>✓ Supports online/incremental learning</li>
                      <li>✓ Memory efficient (processes one sample)</li>
                      <li>✓ Multiple loss functions available</li>
                      <li>✓ Easy to implement and understand</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Requires feature scaling</li>
                      <li>✗ Sensitive to learning rate</li>
                      <li>✗ May not converge without tuning</li>
                      <li>✗ Requires many hyperparameters</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - Binary Classification with SGD</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler

# Binary target (e.g., digit 5 detection)
binary_target = (digits.target == 5).astype(int)

# MUST scale features for SGD
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train SGD with SVM loss
sgd = SGDClassifier(
    loss='hinge',           # SVM with hinge loss
    penalty='l2',           # L2 regularization
    alpha=0.0001,           # Regularization strength
    max_iter=1000,          # Maximum iterations
    tol=1e-3,               # Stopping criterion
    learning_rate='optimal',# Adaptive learning rate
    random_state=42
)

# Train
sgd.fit(X_train_scaled, y_train)

# Cross-validation for robust evaluation
from sklearn.model_selection import cross_val_score
cv_scores = cross_val_score(sgd, X_train_scaled, y_train, cv=5)
print(f"CV Accuracy: {cv_scores.mean():.3f} (+/- {cv_scores.std():.3f})")

# Predict
y_pred = sgd.predict(X_test_scaled)

# For online learning (incremental):
# sgd.partial_fit(X_new_batch, y_new_batch, classes=[0, 1])`}</pre>
              </div>
            </div>

            {/* K-Nearest Neighbors */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">📍</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">K-Nearest Neighbors (KNN)</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Instance-based learning: classifies based on K closest training examples. 
                    Simple, intuitive, no training phase. Distance-based algorithm.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Recommendation systems</li>
                    <li>• Pattern recognition</li>
                    <li>• Small-scale classification tasks</li>
                    <li>• Anomaly detection</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Simple to understand and implement</li>
                      <li>✓ No training phase required</li>
                      <li>✓ Adapts to new data easily</li>
                      <li>✓ Non-parametric (no assumptions)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Slow prediction (O(n) per query)</li>
                      <li>✗ Sensitive to feature scaling</li>
                      <li>✗ Curse of dimensionality</li>
                      <li>✗ Requires storing all training data</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Naive Bayes */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">📊</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">Naive Bayes</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Probabilistic classifier based on Bayes' theorem with independence assumption between features. 
                    Fast, simple, works well with high-dimensional data.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Text classification (spam filtering)</li>
                    <li>• Sentiment analysis</li>
                    <li>• Document categorization</li>
                    <li>• Real-time prediction</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Very fast training and prediction</li>
                      <li>✓ Works well with small datasets</li>
                      <li>✓ Handles high-dimensional data well</li>
                      <li>✓ Simple and interpretable</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Independence assumption often violated</li>
                      <li>✗ "Zero frequency" problem</li>
                      <li>✗ Poor probability estimates</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLUSTERING SECTION */}
        <section id="clustering">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <TrendingUp size={24} className="text-blue-400" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold">Clustering Algorithms</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Unsupervised learning for pattern discovery</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* K-Means */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">🔵</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">K-Means Clustering</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Partitions data into K clusters by minimizing within-cluster variance. Iteratively assigns 
                    points to nearest centroid and updates centroids.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Customer segmentation by behavior</li>
                    <li>• Federal agency spending pattern grouping</li>
                    <li>• Document clustering</li>
                    <li>• Image compression</li>
                    <li>• Anomaly detection (outliers from clusters)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Fast and scalable (O(n))</li>
                      <li>✓ Simple to implement</li>
                      <li>✓ Works well with spherical clusters</li>
                      <li>✓ Guaranteed convergence</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Must specify K in advance</li>
                      <li>✗ Sensitive to initial centroid placement</li>
                      <li>✗ Assumes spherical, similar-size clusters</li>
                      <li>✗ Sensitive to outliers</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - Agency Spending Clustering</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# Prepare features
X = df[['total_budget', 'execution_rate', 'variance_score']]

# Scale features (important for K-Means)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Elbow method to find optimal K
inertias = []
K_range = range(2, 11)
for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(X_scaled)
    inertias.append(kmeans.inertia_)

# Plot elbow curve
plt.plot(K_range, inertias, 'bo-')
plt.xlabel('Number of Clusters (K)')
plt.ylabel('Inertia')
plt.title('Elbow Method For Optimal K')

# Train with optimal K (e.g., K=4)
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_scaled)

# Add cluster labels to dataframe
df['cluster'] = clusters

# Analyze clusters
cluster_summary = df.groupby('cluster').agg({
    'total_budget': 'mean',
    'execution_rate': 'mean',
    'variance_score': 'mean'
}).round(2)

print(cluster_summary)`}</pre>
              </div>
            </div>

            {/* Gaussian Mixture Models */}
            <div className="card p-6">
              <div className="flex items-start gap-4 mb-4">
                <span className="text-5xl">🎲</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-bold mb-2">Gaussian Mixture Models (GMM)</h3>
                  <p className="text-sm text-[hsl(var(--fg-muted))] leading-relaxed">
                    Probabilistic model assuming data is generated from mixture of Gaussian distributions. 
                    Soft clustering with probability assignments. Uses EM algorithm.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-sm mb-3 text-blue-400 flex items-center gap-2">
                    <Lightbulb size={16} />Use Cases
                  </h4>
                  <ul className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                    <li>• Anomaly detection</li>
                    <li>• Density estimation</li>
                    <li>• Soft clustering (probability-based)</li>
                    <li>• Background subtraction in images</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-green-400 flex items-center gap-2">
                      <Check size={16} />Advantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✓ Soft clustering (probabilities)</li>
                      <li>✓ Flexible cluster shapes (ellipsoidal)</li>
                      <li>✓ Can model complex distributions</li>
                      <li>✓ Provides density estimates</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-orange-400 flex items-center gap-2">
                      <X size={16} />Disadvantages
                    </h4>
                    <ul className="space-y-1 text-xs text-[hsl(var(--fg-muted))]">
                      <li>✗ Slower than K-Means</li>
                      <li>✗ Sensitive to initialization</li>
                      <li>✗ Can get stuck in local optima</li>
                      <li>✗ Struggles with non-ellipsoidal clusters</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
                <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                  <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">python - GMM for Anomaly Detection</span>
                </div>
                <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`from sklearn.mixture import GaussianMixture
import numpy as np

# Train GMM
gm = GaussianMixture(n_components=3, n_init=10, random_state=42)
gm.fit(X)

# Model parameters
print(f"Converged: {gm.converged_}")
print(f"Iterations: {gm.n_iter_}")
print(f"Weights: {np.round(gm.weights_, 2)}")

# Soft clustering (probabilities)
probabilities = gm.predict_proba(X)
print(f"Sample belongs to cluster 0 with prob: {probabilities[0, 0]:.3f}")

# Hard clustering (assign to most probable cluster)
clusters = gm.predict(X)

# Anomaly detection using density
densities = gm.score_samples(X)
density_threshold = np.percentile(densities, 4)  # Bottom 4%
anomalies = X[densities < density_threshold]

print(f"Detected {len(anomalies)} anomalies")

# Use BIC/AIC to select optimal number of components
bics = []
for k in range(1, 10):
    gm = GaussianMixture(n_components=k, n_init=10)
    gm.fit(X)
    bics.append(gm.bic(X))

optimal_k = np.argmin(bics) + 1
print(f"Optimal number of components: {optimal_k}")`}</pre>
              </div>
            </div>
          </div>
        </section>

        {/* AI AGENTS SECTION */}
        <section id="ai-section">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <GitBranch size={24} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-4xl font-bold">AI Agents Framework</h2>
              <p className="text-sm text-[hsl(var(--fg-muted))]">Building production-ready agentic systems</p>
            </div>
          </div>

          {/* Quick Implementation */}
          <div className="card p-6 mb-8 border-green-500/20 bg-green-500/5">
            <h3 className="font-display text-2xl font-bold mb-4 flex items-center gap-2">
              <Zap size={24} className="text-green-400" />
              Agent Architecture Overview
            </h3>

            <p className="text-sm text-[hsl(var(--fg-muted))] mb-6 leading-relaxed">
              AI Agents are autonomous systems that can reason, plan, and use tools to accomplish tasks. 
              They combine LLM intelligence with function calling to interact with external systems, 
              databases, and APIs. Based on ReAct (Reasoning + Acting) pattern.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-3xl mb-3">1️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Define Tools</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">
                  Create functions the agent can call: search databases, fetch data, send emails, make API calls. 
                  Each tool has name, description, and parameter schema.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-3xl mb-3">2️⃣</div>
                <h4 className="font-semibold text-sm mb-2">System Prompt</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">
                  Define agent's identity, knowledge domain, capabilities, and behavior. 
                  Specify when to use tools and how to format responses.
                </p>
              </div>

              <div className="p-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg))]">
                <div className="text-3xl mb-3">3️⃣</div>
                <h4 className="font-semibold text-sm mb-2">Agentic Loop</h4>
                <p className="text-xs text-[hsl(var(--fg-muted))] leading-relaxed">
                  Agent decides autonomously: analyze request → call tool if needed → process result → 
                  reason about next step → repeat until task complete.
                </p>
              </div>
            </div>

            <div className="rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--bg-muted))] overflow-hidden">
              <div className="px-4 py-2 border-b border-[hsl(var(--border))]">
                <span className="text-xs font-mono text-[hsl(var(--fg-muted))]">typescript - Production Agent Implementation</span>
              </div>
              <pre className="p-4 text-xs font-mono text-green-300 overflow-x-auto leading-relaxed whitespace-pre">{`import { GoogleGenerativeAI } from '@google/genai';

// 1. Define Tools (Function Declarations)
const tools = [
  {
    name: "search_database",
    description: "Search DoD budget database for obligation data",
    parameters: {
      type: "object",
      properties: {
        account: { type: "string", description: "Appropriation account code" },
        fiscal_year: { type: "number", description: "Fiscal year (2020-2026)" }
      },
      required: ["account"]
    }
  },
  {
    name: "get_audit_status",
    description: "Get FIAR audit status for a DoD component",
    parameters: {
      type: "object",
      properties: {
        component: { type: "string", description: "DoD component name" }
      },
      required: ["component"]
    }
  }
];

// 2. System Prompt
const systemPrompt = \`You are a DoD financial analyst assistant with expertise in:
- Budget execution and obligation tracking
- FIAR audit readiness
- OMB circulars (A-11, A-123)
- DoD Financial Management Regulation

Use your tools to retrieve accurate, current data. Always cite your sources.
Provide clear, professional analysis suitable for senior leadership.\`;

// 3. Agentic Loop Implementation
async function runAgent(userMessage: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: systemPrompt,
    tools: tools
  });

  const chat = model.startChat({ history: [] });
  let response = await chat.sendMessage({ message: userMessage });

  // Iterative loop: agent decides when to use tools
  let iterations = 0;
  const MAX_ITERATIONS = 5;
  
  while (response.functionCalls && iterations < MAX_ITERATIONS) {
    const toolResults = [];
    
    // Execute each tool call
    for (const functionCall of response.functionCalls) {
      console.log(\`Agent calling: \${functionCall.name}\`);
      const result = await executeFunction(functionCall.name, functionCall.args);
      toolResults.push({
        functionResponse: {
          name: functionCall.name,
          response: result
        }
      });
    }
    
    // Send results back to agent
    response = await chat.sendMessage({ message: toolResults });
    iterations++;
  }

  return {
    text: response.text,
    iterations,
    toolCallsMade: iterations > 0
  };
}

// Tool Executor
async function executeFunction(name: string, args: any) {
  switch (name) {
    case 'search_database':
      return await searchBudgetDB(args.account, args.fiscal_year);
    case 'get_audit_status':
      return await getAuditStatus(args.component);
    default:
      return { error: "Unknown function" };
  }
}

// Example usage
const result = await runAgent("What is the obligation rate for account 97X4930 in FY2025?");
console.log(result.text);`}</pre>
            </div>
          </div>

          {/* My Production Agent */}
          <div className="card p-6 border-purple-500/20 bg-purple-500/5">
            <h3 className="font-display text-xl font-bold mb-4">My Production Agent: MyThing Platform</h3>
            <p className="text-sm text-[hsl(var(--fg-muted))] mb-6">
              Live multi-agent system powering this site. 4 specialized agents with 5 tools, intelligent routing, 
              and 500+ daily interactions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-sm mb-3 text-purple-400">Agents</h4>
                <div className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>💼 Portfolio Agent:</strong> Background, skills, certifications
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>🚀 Tech Trends Agent:</strong> Latest AI/ML from 22 sources
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>🏛️ DoD Policy Agent:</strong> Budget, audit, IT policy expert
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>📝 Notes Agent:</strong> Capture & analyze thoughts
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-sm mb-3 text-green-400">Tools</h4>
                <div className="space-y-2 text-xs text-[hsl(var(--fg-muted))]">
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>search_tech_articles:</strong> Query 500+ articles
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>get_platform_stats:</strong> Real-time metrics
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>save_note:</strong> Store with AI analysis
                  </div>
                  <div className="p-2 rounded bg-[hsl(var(--bg-muted))]">
                    <strong>get_recent_notes:</strong> Retrieve insights
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[hsl(var(--bg-muted))] border border-purple-500/30">
              <p className="text-xs text-[hsl(var(--fg-muted))]">
                <strong className="text-purple-400">Key Features:</strong> Automatic routing based on keywords, 
                iterative function calling (up to 3 rounds), model fallback chain (Gemini 2.5 Flash → Flash Lite), 
                conversation history management, structured outputs.
              </p>
            </div>
          </div>

          {/* Kaggle Whitepapers */}
          <div className="mt-8">
            <h3 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-blue-400" />
              Kaggle AI Agents Resources
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="https://www.kaggle.com/whitepaper-introduction-to-agents" target="_blank" rel="noopener noreferrer" 
                 className="card p-4 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Introduction to Agents
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Foundational concepts, ReAct pattern, agent loops
                </p>
              </a>

              <a href="https://www.kaggle.com/whitepaper-agent-tools-and-interoperability-with-mcp" target="_blank" rel="noopener noreferrer"
                 className="card p-4 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Tools & MCP
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Function calling, Model Context Protocol, interoperability
                </p>
              </a>

              <a href="https://www.kaggle.com/whitepaper-context-engineering-sessions-and-memory" target="_blank" rel="noopener noreferrer"
                 className="card p-4 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Context & Memory
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Managing context windows, session handling, state persistence
                </p>
              </a>

              <a href="https://www.kaggle.com/whitepaper-agent-quality" target="_blank" rel="noopener noreferrer"
                 className="card p-4 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Agent Quality
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Testing strategies, evaluation metrics, quality assurance
                </p>
              </a>

              <a href="https://www.kaggle.com/whitepaper-prototype-to-production" target="_blank" rel="noopener noreferrer"
                 className="card p-4 border-blue-500/20 hover:border-blue-500/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-sm group-hover:text-blue-400 transition-colors">
                    Production Deployment
                  </h4>
                  <ExternalLink size={14} className="text-[hsl(var(--fg-muted))] group-hover:text-blue-400 shrink-0" />
                </div>
                <p className="text-xs text-[hsl(var(--fg-muted))]">
                  Scaling, monitoring, best practices for production systems
                </p>
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="card p-8 border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 text-center">
          <Brain size={48} className="text-purple-400 mx-auto mb-4" />
          <h3 className="font-display text-2xl font-bold mb-3">Ask My AI Agent</h3>
          <p className="text-sm text-[hsl(var(--fg-muted))] mb-6 max-w-2xl mx-auto">
            Use the chat widget to ask questions about ML algorithms, AI agents, evaluation metrics, 
            or how I apply these techniques to DoD financial management.
          </p>
          <div className="flex flex-wrap gap-2 justify-center text-xs">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300">💼 Portfolio</span>
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300">🚀 Tech Trends</span>
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300">🏛️ DoD Policy</span>
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300">📝 Notes</span>
          </div>
        </div>
      </div>

      <AIChatWidget page="ai-ml" />
    </div>
  );
}
