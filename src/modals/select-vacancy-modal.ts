import { App, Modal, Setting } from 'obsidian';
import { Vacancy } from '../types';

export class SelectVacancyModal extends Modal {
  private vacancies: Vacancy[];
  private onSelect: (vacancy: Vacancy) => void;

  constructor(app: App, vacancies: Vacancy[], onSelect: (vacancy: Vacancy) => void) {
    super(app);
    this.vacancies = vacancies;
    this.onSelect = onSelect;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Выберите вакансию' });

    if (this.vacancies.length === 0) {
      contentEl.createEl('p', { text: 'Нет доступных вакансий' });
      return;
    }

    this.vacancies.forEach(vacancy => {
      new Setting(contentEl)
        .setName(vacancy.title)
        .setDesc(`${vacancy.company} - ${vacancy.keywords.slice(0, 3).join(', ')}${vacancy.keywords.length > 3 ? '...' : ''}`)
        .addButton(btn => btn
          .setButtonText('Анализировать')
          .setCta()
          .onClick(() => {
            this.onSelect(vacancy);
            this.close();
          }));
    });
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
