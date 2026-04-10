import { App, Modal, Setting } from 'obsidian';
import { Vacancy } from '../types';

export class AddVacancyModal extends Modal {
  private onSubmit: (vacancy: Vacancy) => void;
  private vacancy: Partial<Vacancy> = {};

  constructor(app: App, onSubmit: (vacancy: Vacancy) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  onOpen() {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Добавить вакансию' });

    new Setting(contentEl)
      .setName('Компания')
      .addText(text => text
        .setPlaceholder('Название компании')
        .onChange(value => this.vacancy.company = value));

    new Setting(contentEl)
      .setName('Название вакансии')
      .addText(text => text
        .setPlaceholder('Frontend Developer')
        .onChange(value => this.vacancy.title = value));

    new Setting(contentEl)
      .setName('URL вакансии')
      .addText(text => text
        .setPlaceholder('https://...')
        .onChange(value => this.vacancy.url = value));

    new Setting(contentEl)
      .setName('Описание')
      .addTextArea(text => text
        .setPlaceholder('Описание вакансии...')
        .onChange(value => this.vacancy.description = value));

    new Setting(contentEl)
      .setName('Ключевые слова')
      .setDesc('Через запятую')
      .addText(text => text
        .setPlaceholder('React, TypeScript, Node.js')
        .onChange(value => {
          this.vacancy.keywords = value.split(',').map(k => k.trim());
        }));

    new Setting(contentEl)
      .addButton(btn => btn
        .setButtonText('Добавить')
        .setCta()
        .onClick(() => {
          if (this.vacancy.company && this.vacancy.title) {
            this.onSubmit({
              id: Date.now().toString(),
              company: this.vacancy.company,
              title: this.vacancy.title,
              url: this.vacancy.url || '',
              description: this.vacancy.description || '',
              keywords: this.vacancy.keywords || []
            });
            this.close();
          }
        }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
