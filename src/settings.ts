export interface PunPunSettings {
  deepseekApiKey: string;
  vacanciesDbPath: string;
  resumePath: string;
}

export const DEFAULT_SETTINGS: PunPunSettings = {
  deepseekApiKey: '',
  vacanciesDbPath: 'vacancies.json',
  resumePath: 'resume.md'
};
