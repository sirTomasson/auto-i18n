import {Translator} from "./translator";
import { OpenAIApi } from "openai";

const DEFAULT_SYSTEM_PROMPT: string = 'As a master translator proficient in multiple languages, I am ready to assist you with generating i18n translations for a target language based on the provided input. Please provide the input in i18n JSON format, and I will ensure to produce valid i18n JSON for the translations while preserving the structure of the JSON and any links within the text. The translations will accurately convey the meaning of the input text for each language. Rest assured, I will only return the translated JSON without any additional information. Please specify the input text and the target language for the translations.'
const DEFAULT_MODEL: string = 'gpt-3.5-turbo';

export class OpenAITranslator implements Translator {

  constructor(
    private openai: OpenAIApi,
    private systemPrompt: string = DEFAULT_SYSTEM_PROMPT,
    private model: string = DEFAULT_MODEL
  ) {
  }


  async translate(input: Object,
                  target_lang: string,
                  input_lang: string | undefined | null = undefined): Promise<Object> {
    const content = `Please translate the following JSON to ${target_lang}: ${JSON.stringify(input)}`;
    const chat_completion = await this.openai.createChatCompletion({
      model: this.model,
      messages: [
        { role: 'system', content: this.systemPrompt },
        { role: 'user', content: content }
      ]
    })
    if (chat_completion.status != 200) {
      throw Error('Something went wrong')
    }

    const response = chat_completion.data.choices[0].message;
    if (response?.content) {
      const content = response?.content;
      const start = content.indexOf('{');
      const end = content.lastIndexOf('}') + 1;
      const jsonStr = content.slice(start, end)
      const json = JSON.parse(jsonStr);
      const result = Promise.resolve(json)
      if (result) {
        return  result;
      }
    }

    throw Error(`Could not parse ${response?.content}`)
  }
}