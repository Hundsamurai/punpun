export interface Vacancy {
  id: string;
  company: string;
  title: string;
  url: string;
  description: string;
  keywords: string[];
}

export interface VacancyAnalysis {
  vacancy: Vacancy;
  matchScore: number;
  keywordCoverage: number;
  recommendations: string[];
  missingKeywords: string[];
  presentKeywords: string[];
  coverLetter: string;
}
