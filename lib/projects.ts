// ADD THIS NEW PROJECT TO lib/projects.ts
// Insert it at the beginning of the PROJECTS array (after the existing projects)

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

// The complete PROJECTS array should look like this (showing first few entries):

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
  // ... rest of existing projects
];

// Also update FEATURED_PROJECTS at the bottom of the file:
export const FEATURED_PROJECTS = PROJECTS.filter(p => p.featured);
