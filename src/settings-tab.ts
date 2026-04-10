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

    // AI Provider selection
    new Setting(containerEl)
      .setName('AI провайдер')
      .setDesc('Выберите провайдера для анализа резюме')
      .addDropdown(dropdown => dropdown
        .addOption('deepseek', 'DeepSeek')
        .addOption('openrouter', 'OpenRouter')
        .setValue(this.plugin.settings.aiProvider)
        .onChange(async (value: 'deepseek' | 'openrouter') => {
          this.plugin.settings.aiProvider = value;
          await this.plugin.saveSettings();
          this.display(); // Refresh to show/hide relevant settings
        }));

    // DeepSeek settings
    if (this.plugin.settings.aiProvider === 'deepseek') {
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
    }

    // OpenRouter settings
    if (this.plugin.settings.aiProvider === 'openrouter') {
      new Setting(containerEl)
        .setName('API ключ OpenRouter')
        .setDesc('Введите ваш API ключ для OpenRouter')
        .addText(text => text
          .setPlaceholder('sk-or-v1-...')
          .setValue(this.plugin.settings.openrouterApiKey)
          .onChange(async (value) => {
            this.plugin.settings.openrouterApiKey = value;
            await this.plugin.saveSettings();
          }));

      new Setting(containerEl)
        .setName('Модель OpenRouter')
        .setDesc('Выберите модель для использования')
        .addDropdown(dropdown => dropdown
          .addOption('anthropic/claude-3.5-sonnet', 'Claude 3.5 Sonnet')
          .addOption('anthropic/claude-3-opus', 'Claude 3 Opus')
          .addOption('openai/gpt-4-turbo', 'GPT-4 Turbo')
          .addOption('openai/gpt-4o', 'GPT-4o')
          .addOption('google/gemini-pro-1.5', 'Gemini Pro 1.5')
          .addOption('meta-llama/llama-3.1-70b-instruct', 'Llama 3.1 70B')
          .addOption('nvidia/nemotron-3-super-120b-a12b:free', '🆓 Nvidia Nemotron 120B')
          .addOption('arcee-ai/trinity-large-preview:free', '🆓 Arcee Trinity Large')
          .addOption('z-ai/glm-4.5-air:free', '🆓 GLM 4.5 Air')
          .addOption('openai/gpt-oss-120b:free', '🆓 GPT OSS 120B')
          .setValue(this.plugin.settings.openrouterModel)
          .onChange(async (value) => {
            this.plugin.settings.openrouterModel = value;
            await this.plugin.saveSettings();
          }));
    }

    // Common settings
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
