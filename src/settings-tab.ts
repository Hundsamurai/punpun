import { App, PluginSettingTab, Setting } from 'obsidian';
import PunPunPlugin from '../main';

export class PunPunSettingTab extends PluginSettingTab {
  plugin: PunPunPlugin;

  constructor(app: App, plugin: PunPunPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Настройки PunPun' });

    new Setting(containerEl)
      .setName('API ключ DeepSeek')
      .setDesc('Введите ваш API ключ для DeepSeek')
      .addText(text => text
        .setPlaceholder('sk-...')
        .setValue(this.plugin.settings.deepseekApiKey)
        .onChange(async (value) => {
          this.plugin.settings.deepseekApiKey = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Путь к базе вакансий')
      .setDesc('Путь к JSON файлу с вакансиями')
      .addText(text => text
        .setPlaceholder('vacancies.json')
        .setValue(this.plugin.settings.vacanciesDbPath)
        .onChange(async (value) => {
          this.plugin.settings.vacanciesDbPath = value;
          await this.plugin.saveSettings();
        }));

    new Setting(containerEl)
      .setName('Путь к резюме')
      .setDesc('Путь к файлу с вашим резюме')
      .addText(text => text
        .setPlaceholder('resume.md')
        .setValue(this.plugin.settings.resumePath)
        .onChange(async (value) => {
          this.plugin.settings.resumePath = value;
          await this.plugin.saveSettings();
        }));
  }
}
