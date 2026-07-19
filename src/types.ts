export interface Submission {
  id: string;
  name: string;
  role: string;
  track: string;
  timestamp: string;
}

export interface Review {
  id: string;
  quote: string;
  author: string;
  age: number;
  role: string;
  source: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Series {
  id: string;
  title: string;
  tagline: string;
  description: string;
  logs: string[];
  duration: string;
  status: string;
}
