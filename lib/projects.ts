export type ProjectCategory = 'federal-finance' | 'data-science' | 'full-stack' | 'ai-ml';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  tech: string[];
  links: { label: string; url: string }[];
  featured: boolean;
  year: number;
}

export const PROJECTS: Project[] = [
  {
    id: 'ml-ai-hub',
    title: 'ML AI Knowledge Hub (mlaithing.vercel.app)',
    description: 'Comprehensive machine learning reference with 8+ algorithms (Logistic Regression, SVM, Random Forest, SGD, KNN, Naive Bayes, K-Means, GMM), complete evaluation metrics guide, clustering techniques, and production AI agents framework with ReAct pattern. Real-world DoD/federal use cases throughout.',
    category: 'ai-ml',
    tech: ['Next.js 15', 'TypeScript', 'Gemini 2.5', 'ML Algorithms', 'Tailwind CSS', 'React 19'],
    links: [
      { label: 'Live Site', url: 'https://mlaithing.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/icetonges/mlaithing' },
    ],
    featured: true,
    year: 2026,
  },
  {
    id: 'modern-resume',
    title: 'AI-Powered Portfolio (petershang.vercel.app)',
    description: 'Full-stack portfolio with agentic Gemini 2.5 AI assistant using Google Search grounding, PostgreSQL, Gmail SMTP notifications, and dark/light theme. Built with Next.js 15, React 19, TypeScript.',
    category: 'full-stack',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Gemini 2.5', 'Prisma', 'Nodemailer'],
    links: [
      { label: 'Live Site', url: 'https://petershang.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/icetonges/modern-resume' },
    ],
    featured: true,
    year: 2025,
  },
  {
    id: 'mything',
    title: 'MyThing — Personal Knowledge Platform (shangthing.vercel.app)',
    description: 'Personal digital garden and knowledge management system with private notes, AI summarization, tech trend aggregation, and federal finance knowledge base.',
    category: 'full-stack',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'NextAuth', 'Gemini 2.5'],
    links: [
      { label: 'Live Site', url: 'https://shangthing.vercel.app' },
      { label: 'GitHub', url: 'https://github.com/icetonges' },
    ],
    featured: true,
    year: 2026,
  },
  {
    id: 'budget-matter',
    title: 'Budget Matter — Federal Budget Analysis Tool',
    description: 'Interactive visualization and analysis platform for federal budget data, OMB submissions, and DoD financial reporting. Built to demonstrate federal financial management expertise.',
    category: 'federal-finance',
    tech: ['Python', 'Pandas', 'Tableau', 'PostgreSQL', 'D3.js'],
    links: [
      { label: 'GitHub Pages', url: 'https://budgetmatter.github.io' },
      { label: 'GitHub', url: 'https://github.com/icetonges' },
    ],
    featured: false,
    year: 2024,
  },
  {
    id: 'ai-agents-course',
    title: 'Google/Kaggle AI Agents Intensive — Capstone',
    description: 'Multi-day intensive on agentic AI systems including function calling, tool use, RAG architectures, and agent orchestration. Completed Nov 2025 with Kaggle certification.',
    category: 'ai-ml',
    tech: ['Python', 'Gemini API', 'LangChain', 'RAG', 'Function Calling'],
    links: [
      { label: 'Kaggle Notebooks', url: 'https://www.kaggle.com/icetonges' },
    ],
    featured: true,
    year: 2025,
  },
  {
    id: 'federal-nlp',
    title: 'Federal Policy NLP Analyzer',
    description: 'NLP pipeline to extract key requirements, deadlines, and metrics from OMB circulars and DoD financial management regulations. Uses transformer models.',
    category: 'ai-ml',
    tech: ['Python', 'HuggingFace', 'spaCy', 'BERT', 'FastAPI'],
    links: [
      { label: 'GitHub', url: 'https://github.com/icetonges' },
    ],
    featured: false,
    year: 2024,
  },
  {
    id: 'budget-forecasting',
    title: 'DoD Budget Execution Forecasting Model',
    description: 'Time series forecasting model using Prophet and ARIMA to predict federal budget execution rates and identify obligation patterns across appropriation accounts.',
    category: 'data-science',
    tech: ['Python', 'Prophet', 'ARIMA', 'Pandas', 'scikit-learn'],
    links: [
      { label: 'GitHub', url: 'https://github.com/icetonges' },
    ],
    featured: true,
    year: 2024,
  },
  {
    id: 'fiar-dashboard',
    title: 'FIAR Audit Readiness Dashboard',
    description: 'Real-time dashboard tracking Financial Improvement and Audit Readiness (FIAR) metrics, control deficiencies, and corrective action plans for DoD financial statements.',
    category: 'federal-finance',
    tech: ['Python', 'Dash', 'Plotly', 'PostgreSQL'],
    links: [
      { label: 'Demo', url: 'https://github.com/icetonges' },
    ],
    featured: false,
    year: 2023,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
