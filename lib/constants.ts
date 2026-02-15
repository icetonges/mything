// lib/constants.ts — LINKS, owner info, site metadata
export const LINKS = {
  resume:   'https://petershang.vercel.app',
  github:   'https://github.com/icetonges',
  kaggle:   'https://www.kaggle.com/icetonges',
  linkedin: 'https://www.linkedin.com/in/xiaobing-peter-shang/',
  portfolio:'https://budgetmatter.github.io',
  email:    'icetonges@gmail.com',
};

export const SITE = {
  name: 'MyThing',
  description: 'Personal knowledge management, showcase, and AI-powered digital garden',
  url: 'https://mything.vercel.app',
  owner: 'Peter Shang',
  ownerTitle: 'Federal Financial Management | Data Science | AI Enabler',
};

export const OWNER_EMAIL = process.env.OWNER_EMAIL ?? 'icetonges@gmail.com';
