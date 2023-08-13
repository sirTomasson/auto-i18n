
export interface Translator {
  translate(input: string, target_lang: string, input_lang: string | undefined | null): Promise<Object>;
}