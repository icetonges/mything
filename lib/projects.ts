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
    title: 'MyThing — Personal Knowledge Platform (mything.vercel.app)',
    description: 'Personal digital garden and knowledge management system with private notes, AI summarization, tech trend aggregation, and federal finance knowledge base.',
    category: 'full-stack',
    tech: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'NextAuth', 'Gemini 2.5'],
    links: [
      { label: 'Live Site', url: 'https://mything.vercel.app' },
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
    featured: true,
    year: 2024,
  },
  {
    id: 'ai-agents-intensive',
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
    id: 'ibm-data-science',
    title: 'IBM Data Science Professional Certificate',
    description: 'End-to-end data science pipeline including data wrangling, EDA, machine learning, and visualization. Applied to federal financial dataset analysis.',
    category: 'data-science',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'NumPy', 'Matplotlib', 'Jupyter'],
    links: [
      { label: 'Kaggle Profile', url: 'https://www.kaggle.com/icetonges' },
    ],
    featured: false,
    year: 2024,
  },
  {
    id: 'dod-financial-dashboard',
    title: 'DoD OIG Financial Risk Dashboard',
    description: 'Internal dashboard for tracking audit findings, financial risk indicators, and corrective action plans across DoD components. GS-15 led development.',
    category: 'federal-finance',
    tech: ['Tableau', 'Excel', 'SQL', 'Python'],
    links: [],
    featured: false,
    year: 2023,
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
    id: 'budget-forecast',
    title: 'Pentagon Budget Execution Forecasting Model',
    description: 'ML model predicting end-of-year budget execution rates using historical obligation patterns, continuing resolution data, and congressional action timelines.',
    category: 'data-science',
    tech: ['Python', 'XGBoost', 'Prophet', 'Pandas', 'Matplotlib'],
    links: [
      { label: 'Kaggle', url: 'https://www.kaggle.com/icetonges' },
    ],
    featured: true,
    year: 2024,
  },
];

export const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
export const getProjectsByCategory = (cat: ProjectCategory) => PROJECTS.filter(p => p.category === cat);
