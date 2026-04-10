import { App, TFile } from 'obsidian';
import { Vacancy } from './types';

export class VacancyManager {
  private app: App;
  private dbPath: string;

  constructor(app: App, dbPath: string) {
    this.app = app;
    this.dbPath = dbPath;
  }

  async loadVacancies(): Promise<Vacancy[]> {
    try {
      const file = this.app.vault.getAbstractFileByPath(this.dbPath);
      if (!(file instanceof TFile)) {
        return [];
      }
      const content = await this.app.vault.read(file);
      return JSON.parse(content);
    } catch (error) {
      console.error('Ошибка загрузки вакансий:', error);
      return [];
    }
  }

  async saveVacancies(vacancies: Vacancy[]): Promise<void> {
    try {
      const content = JSON.stringify(vacancies, null, 2);
      const file = this.app.vault.getAbstractFileByPath(this.dbPath);
      
      if (file instanceof TFile) {
        await this.app.vault.modify(file, content);
      } else {
        await this.app.vault.create(this.dbPath, content);
      }
    } catch (error) {
      console.error('Ошибка сохранения вакансий:', error);
      throw error;
    }
  }

  async addVacancy(vacancy: Vacancy): Promise<void> {
    const vacancies = await this.loadVacancies();
    vacancies.push(vacancy);
    await this.saveVacancies(vacancies);
  }
}
