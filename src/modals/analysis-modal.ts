import { App, Modal } from 'obsidian';
import { VacancyAnalysis } from '../types';

export class AnalysisModal extends Modal {
  private analysis: VacancyAnalysis;

  constructor(app: App, analysis: VacancyAnalysis) {
    super(app);
    this.analysis = analysis;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Результат анализа' });

    const container = contentEl.createDiv({ cls: 'punpun-analysis' });

    container.createEl('h3', { text: this.analysis.vacancy.title });
    container.createEl('p', { text: `Компания: ${this.analysis.vacancy.company}` });

    const scoreDiv = container.createDiv({ cls: 'punpun-scores' });
    scoreDiv.createEl('p', { text: `📊 Соответствие: ${this.analysis.matchScore}%` });
    scoreDiv.createEl('p', { text: `🔑 Покрытие ключевых слов: ${this.analysis.keywordCoverage}%` });

    if (this.analysis.presentKeywords && this.analysis.presentKeywords.length > 0) {
      container.createEl('h4', { text: '✅ Найденные ключевые слова:' });
      const presentList = container.createEl('ul');
      this.analysis.presentKeywords.forEach(keyword => {
        presentList.createEl('li', { text: keyword, cls: 'punpun-keyword-present' });
      });
    }

    if (this.analysis.missingKeywords.length > 0) {
      container.createEl('h4', { text: '❌ Отсутствующие ключевые слова:' });
      const keywordsList = container.createEl('ul');
      this.analysis.missingKeywords.forEach(keyword => {
        keywordsList.createEl('li', { text: keyword, cls: 'punpun-keyword-missing' });
      });
    }

    if (this.analysis.recommendations.length > 0) {
      container.createEl('h4', { text: '💡 Рекомендации:' });
      const recList = container.createEl('ul');
      this.analysis.recommendations.forEach(rec => {
        recList.createEl('li', { text: rec });
      });
    }

    if (this.analysis.coverLetter) {
      container.createEl('h4', { text: '✉️ Сопроводительное письмо:' });
      const letterDiv = container.createDiv({ cls: 'punpun-cover-letter' });
      letterDiv.createEl('p', { text: this.analysis.coverLetter });
      
      const copyBtn = container.createEl('button', { 
        text: '📋 Скопировать письмо',
        cls: 'mod-cta'
      });
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(this.analysis.coverLetter);
        copyBtn.textContent = '✓ Скопировано!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Скопировать письмо';
        }, 2000);
      });
    }
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
