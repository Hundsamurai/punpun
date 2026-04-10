import { App, Notice, Plugin, TFile } from 'obsidian';
import { PunPunSettings, DEFAULT_SETTINGS } from './src/settings';
import { PunPunSettingTab } from './src/settings-tab';
import { VacancyManager } from './src/vacancy-manager';
import { AIAPI } from './src/ai-api';
import { AddVacancyModal } from './src/modals/add-vacancy-modal';
import { AnalysisModal } from './src/modals/analysis-modal';
import { SelectVacancyModal } from './src/modals/select-vacancy-modal';
import { Vacancy, VacancyAnalysis } from './src/types';

export default class PunPunPlugin extends Plugin {
  settings: PunPunSettings;
  vacancyManager: VacancyManager;

  async onload() {
    await this.loadSettings();

    this.vacancyManager = new VacancyManager(this.app, this.settings.vacanciesDbPath);

    // Команда: Добавить вакансию
    this.addCommand({
      id: 'add-vacancy',
      name: 'Добавить вакансию',
      callback: () => {
        new AddVacancyModal(this.app, async (vacancy) => {
          try {
            await this.vacancyManager.addVacancy(vacancy);
            new Notice('Вакансия добавлена!');
          } catch (error) {
            new Notice('Ошибка при добавлении вакансии');
            console.error(error);
          }
        }).open();
      }
    });

    // Команда: Анализировать резюме по всем вакансиям
    this.addCommand({
      id: 'analyze-resume',
      name: 'Анализировать резюме по всем вакансиям',
      callback: async () => {
        await this.analyzeResume();
      }
    });

    // Команда: Анализировать резюме по конкретной вакансии
    this.addCommand({
      id: 'analyze-resume-single',
      name: 'Анализировать резюме по выбранной вакансии',
      callback: async () => {
        const vacancies = await this.vacancyManager.loadVacancies();
        if (vacancies.length === 0) {
          new Notice('Нет вакансий для анализа');
          return;
        }
        
        new SelectVacancyModal(this.app, vacancies, async (vacancy) => {
          await this.analyzeResumeForVacancy(vacancy);
        }).open();
      }
    });

    this.addSettingTab(new PunPunSettingTab(this.app, this));
  }

  async analyzeResumeForVacancy(vacancy: Vacancy) {
    const apiKey = this.settings.aiProvider === 'deepseek' 
      ? this.settings.deepseekApiKey 
      : this.settings.openrouterApiKey;

    if (!apiKey) {
      new Notice(`Укажите API ключ для ${this.settings.aiProvider === 'deepseek' ? 'DeepSeek' : 'OpenRouter'} в настройках`);
      return;
    }

    const resumeFile = this.app.vault.getAbstractFileByPath(this.settings.resumePath);
    if (!(resumeFile instanceof TFile)) {
      new Notice('Файл резюме не найден');
      return;
    }

    const resume = await this.app.vault.read(resumeFile);
    new Notice(`Анализирую вакансию: ${vacancy.title}...`);
    
    const api = new AIAPI({
      provider: this.settings.aiProvider,
      apiKey: apiKey,
      model: this.settings.openrouterModel
    });

    try {
      const result = await api.analyzeResume(resume, vacancy.description, vacancy.keywords, vacancy.company, vacancy.title);
      
      // Парсим JSON ответ
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        const analysis: VacancyAnalysis = {
          vacancy,
          matchScore: parsed.matchScore || 0,
          keywordCoverage: parsed.keywordCoverage || 0,
          recommendations: parsed.recommendations || [],
          missingKeywords: parsed.missingKeywords || [],
          presentKeywords: parsed.presentKeywords || [],
          coverLetter: parsed.coverLetter || ''
        };

        new AnalysisModal(this.app, analysis).open();
      }
    } catch (error) {
      console.error('Ошибка анализа:', error);
      new Notice(`Ошибка при анализе вакансии ${vacancy.title}`);
    }
  }

  async analyzeResume() {
    const apiKey = this.settings.aiProvider === 'deepseek' 
      ? this.settings.deepseekApiKey 
      : this.settings.openrouterApiKey;

    if (!apiKey) {
      new Notice(`Укажите API ключ для ${this.settings.aiProvider === 'deepseek' ? 'DeepSeek' : 'OpenRouter'} в настройках`);
      return;
    }

    const resumeFile = this.app.vault.getAbstractFileByPath(this.settings.resumePath);
    if (!(resumeFile instanceof TFile)) {
      new Notice('Файл резюме не найден');
      return;
    }

    const resume = await this.app.vault.read(resumeFile);
    const vacancies = await this.vacancyManager.loadVacancies();

    if (vacancies.length === 0) {
      new Notice('Нет вакансий для анализа');
      return;
    }

    new Notice('Начинаю анализ всех вакансий...');
    const api = new AIAPI({
      provider: this.settings.aiProvider,
      apiKey: apiKey,
      model: this.settings.openrouterModel
    });

    for (const vacancy of vacancies) {
      try {
        const result = await api.analyzeResume(resume, vacancy.description, vacancy.keywords, vacancy.company, vacancy.title);
        
        // Парсим JSON ответ
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          
          const analysis: VacancyAnalysis = {
            vacancy,
            matchScore: parsed.matchScore || 0,
            keywordCoverage: parsed.keywordCoverage || 0,
            recommendations: parsed.recommendations || [],
            missingKeywords: parsed.missingKeywords || [],
            presentKeywords: parsed.presentKeywords || [],
            coverLetter: parsed.coverLetter || ''
          };

          new AnalysisModal(this.app, analysis).open();
        }
      } catch (error) {
        console.error('Ошибка анализа:', error);
        new Notice(`Ошибка при анализе вакансии ${vacancy.title}`);
      }
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
