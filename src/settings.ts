export type AIProvider = 'deepseek' | 'openrouter';

export interface PunPunSettings {
  aiProvider: AIProvider;
  deepseekApiKey: string;
  openrouterApiKey: string;
  openrouterModel: string;
  vacanciesDbPath: string;
  resumePath: string;
}

export const DEFAULT_SETTINGS: PunPunSettings = {
  aiProvider: 'deepseek',
  deepseekApiKey: '',
  openrouterApiKey: '',
  openrouterModel: 'anthropic/claude-3.5-sonnet',
  vacanciesDbPath: 'vacancies.json',
  resumePath: 'resume.md'
};
