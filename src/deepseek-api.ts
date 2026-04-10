import { requestUrl } from 'obsidian';

export class DeepSeekAPI {
  private apiKey: string;
  private baseUrl = 'https://api.deepseek.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async analyzeResume(resume: string, vacancyDescription: string, keywords: string[], companyName: string, vacancyTitle: string): Promise<string> {
    const prompt = `Ты — эксперт по подбору персонала и алгоритмам современных ATS-систем (hh.ru, Habr Career, Getmatch). Проведи оценку соответствия резюме вакансии, имитируя логику продвинутых ATS: семантический анализ, взвешенное скоринговое моделирование, разделение на обязательные и желательные требования, проверку контекста использования навыков, оценку метрик и ATS-читаемости.

ВАКАНСИЯ: ${vacancyTitle}
КОМПАНИЯ: ${companyName}

ОПИСАНИЕ ВАКАНСИИ:
${vacancyDescription}

КЛЮЧЕВЫЕ ТРЕБОВАНИЯ:
${keywords.join(', ')}

РЕЗЮМЕ:
${resume}

МЕТОДОЛОГИЯ ОЦЕНКИ:
1. Раздели требования вакансии на обязательные (must-have) и желательные (nice-to-have) на основе формулировок ("обязательно", "требуется", "будет плюсом", "опыт работы с").
2. Оценивай семантически: учитывай синонимы, смежные технологии, фреймворки-аналоги и контекст применения навыков. Не штрафуй за отсутствие точного слова, если контекст и стек совпадают.
3. Рассчитай matchScore как взвешенную сумму:
   - Hard Skills & Tech Stack: 30%
   - Релевантный опыт, сроки и измеримые достижения: 30%
   - Образование, сертификации, soft skills: 15%
   - Соответствие уровню позиции (junior/middle/senior) и роли: 15%
   - ATS-структура и читаемость (отсутствие таблиц, графики, корректные заголовки, хронология): 10%
4. keywordCoverage — процент найденных ключевых слов (с учётом семантики и контекста) от общего списка.
5. Штрафуй за: keyword stuffing, отсутствие метрик/результатов, устаревший стек без подтверждения актуальным опытом, несоответствие seniority, сложную вёрстку (колонки, инфографика, нестандартные шрифты).
6. Формируй рекомендации, которые реально повысят прохождение ATS-фильтров и конверсию от рекрутера: конкретные формулировки, добавление метрик, перефразирование под стек, оптимизация структуры под парсинг.
7. Сгенерируй живой, естественный отклик на вакансию «${vacancyTitle}» в компанию «${companyName}» так, будто его написала реальный кандидат или кандидатка. Один абзац, максимум два. Стиль — «вкусный», лаконичный, без воды и шаблонов. Коротко, по делу, с акцентом на сильные стороны и соответствие требованиям.

ВЕРНИ СТРОГО ВАЛИДНЫЙ JSON (без markdown, без пояснений, только объект):
{
  "matchScore": 0-100,
  "keywordCoverage": 0-100,
  "missingKeywords": ["строка", "..."],
  "presentKeywords": ["строка", "..."],
  "breakdown": {
    "hardSkills": 0-100,
    "experienceAndAchievements": 0-100,
    "educationSoftSkills": 0-100,
    "roleAndSeniorityAlignment": 0-100,
    "atsReadability": 0-100
  },
  "recommendations": ["конкретная рекомендация 1", "конкретная рекомендация 2", "..."],
  "atsOptimizationTips": ["совет по структуре", "совет по формулировкам", "..."],
  "coverLetter": "текст сопроводительного письма"
}`;

    try {
      const response = await requestUrl({
        url: `${this.baseUrl}/chat/completions`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: 0.7
        })
      });

      const content = response.json.choices[0].message.content;
      return content;
    } catch (error) {
      console.error('DeepSeek API error:', error);
      throw new Error('Ошибка при обращении к DeepSeek API');
    }
  }
}
