// lib/projects.ts — typed project data for My Work page
export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'federal-finance' | 'data-science' | 'full-stack' | 'ai-ml';
  tech: string[];
  links: { label: string; url: string }[];
  featured: boolean;
}

export const PROJECTS: Project[] = [
  {
    id: 'budgetmatter',
    title: 'Budget Matter Portfolio',
    description: 'Federal budget visualization and financial management tools built with Tableau and Python.',
    category: 'federal-finance',
    tech: ['Tableau', 'Python', 'Pandas'],
    links: [{ label: 'Live', url: 'https://budgetmatter.github.io' }],
    featured: true,
  },
  {
    id: 'petershang-resume',
    title: 'Peter Shang Resume Site',
    description: 'Modern full-stack resume and portfolio with AI chat, dark mode, and contact form.',
    category: 'full-stack',
    tech: ['Next.js', 'React', 'Tailwind', 'Vercel'],
    links: [{ label: 'Live', url: 'https://petershang.vercel.app' }, { label: 'GitHub', url: 'https://github.com/icetonges/modern-resume' }],
    featured: true,
  },
  {
    id: 'mything',
    title: 'MyThing Platform',
    description: 'Personal knowledge management and showcase platform with AI-powered notes and tech trends.',
    category: 'full-stack',
    tech: ['Next.js 15', 'Prisma', 'PostgreSQL', 'Gemini'],
    links: [{ label: 'Live', url: 'https://mything.vercel.app' }],
    featured: true,
  },
  {
    id: 'ds670-capstone',
    title: 'DoD Spending Capstone',
    description: 'Data science capstone on DoD spending enriched data — analysis and visualizations.',
    category: 'data-science',
    tech: ['Python', 'Pandas', 'Jupyter', 'USAspending API'],
    links: [],
    featured: true,
  },
  {
    id: 'usa-spending',
    title: 'USAspending Bulk Download',
    description: 'Notebooks for USAspending bulk download and contract fetch pipelines.',
    category: 'federal-finance',
    tech: ['Python', 'Pandas', 'API'],
    links: [],
    featured: false,
  },
  {
    id: 'sentiment-analysis',
    title: 'Sentiment Analysis (Text Mining)',
    description: 'Text mining and sentiment analysis with NLP techniques.',
    category: 'ai-ml',
    tech: ['Python', 'NLP', 'scikit-learn'],
    links: [],
    featured: false,
  },
  {
    id: 'recommendation-system',
    title: 'Recommendation System',
    description: 'Collaborative filtering and recommendation engine implementation.',
    category: 'ai-ml',
    tech: ['Python', 'ML'],
    links: [],
    featured: false,
  },
  {
    id: 'hierarchical-clustering',
    title: 'Hierarchical Clustering with Dendrograms',
    description: 'Clustering analysis with dendrogram visualization.',
    category: 'data-science',
    tech: ['Python', 'scikit-learn'],
    links: [],
    featured: false,
  },
  {
    id: 'market-basket',
    title: 'Market Basket Analysis',
    description: 'Association rules and market basket analysis.',
    category: 'data-science',
    tech: ['Python', 'Pandas'],
    links: [],
    featured: false,
  },
  {
    id: 'ds630-ml',
    title: 'DS630 ML Final Project',
    description: 'Machine learning project with classification and model comparison.',
    category: 'ai-ml',
    tech: ['Python', 'scikit-learn', 'Jupyter'],
    links: [],
    featured: false,
  },
  {
    id: 'ds640-knn',
    title: 'DS640 KNN Assignment',
    description: 'K-Nearest Neighbors implementation and evaluation.',
    category: 'ai-ml',
    tech: ['Python', 'scikit-learn'],
    links: [],
    featured: false,
  },
  {
    id: 'pe-iris',
    title: 'PE Iris Dataset Analysis',
    description: 'Exploratory data analysis on Iris dataset.',
    category: 'data-science',
    tech: ['Python', 'Pandas', 'Matplotlib'],
    links: [],
    featured: false,
  },
];
