import {Configuration, OpenAIApi} from 'openai';
import {OpenAITranslator} from './translator/openai_translator';
import {readdirSync, readFileSync, writeFileSync} from 'fs';
import {config as dotenvConfig} from 'dotenv';
import {IStringIndex, objComplement, patchObj} from './diff'
import {dirOf, tryReadFile} from "./util";

dotenvConfig();

const openaiApiKey = process.env.OPENAI_API_KEY
if (!openaiApiKey) {
  console.log('Could not read OPENAI_API_KEY from env');
  process.exit(1);
}

const inputPath = process.argv[2]
if (!inputPath) {
  console.log('Missing first argument inputPath')
  process.exit(1);
}

let outDir = process.argv[3];

const config =new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});


const openAiApi = new OpenAIApi(config);
const systemPromptTxt = tryReadFile('./system_prompt.txt');
if (systemPromptTxt) {
  console.log('[INFO] Using contents of system_prompt.txt for OpenAI system prompt')
}
const openTranslator = new OpenAITranslator(openAiApi, systemPromptTxt);

const langCodeLangMap: IStringIndex = {
  'nl': 'Dutch',
  'en': 'English',
  'de': 'German',
  'es': 'Spanish',
  'fr': 'French',
  'pl': 'Polish',
  'ru': 'Russian',
  'zh': 'Chinese simplified'
}

const langCodeEmoteMap: Record<string, string> = {
  'nl': '🇳🇱',
  'en': '🇬🇧',
  'de': '🇩🇪',
  'es': '🇪🇸',
  'fr': '🇫🇷',
  'pl': '🇵🇱',
  'ru': '🇷🇺',
  'zh': '🇨🇳'
}

function listJsonFilesExpect(expectFile: string): string[] {
  const path = toDirPath(expectFile);
  const jsonFiles = listJsonFiles(path);
  return jsonFiles.filter((value) => value !== expectFile)
}

function toDirPath(inputPath: string): string {
  const index = inputPath.lastIndexOf('/')
  return inputPath.slice(0, index)
}

function listJsonFiles(path: string): string[] {
  return listFiles(path).filter((value) => value.endsWith('.json'))
}

function listFiles(path: string): string[] {
  return readdirSync(path).map((value) => `${path}/${value}`)
}

function toLangCode(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1, path.lastIndexOf('.'))
}

(async () => {
  const source = JSON.parse(readFileSync(inputPath, {encoding: 'utf-8'}));
  const targetPaths = listJsonFilesExpect(inputPath);
  outDir = outDir === undefined ? dirOf(inputPath) : outDir;
  const sourceLangCode = toLangCode(inputPath);
  const sourceLang = langCodeLangMap[sourceLangCode];
  const sourceLangeEmote = langCodeEmoteMap[sourceLangCode];

  for (const targetPath of targetPaths) {
    let target = JSON.parse(readFileSync(targetPath, {encoding: 'utf-8'}));
    let targetLangCode = toLangCode(targetPath)
    let targetLang = langCodeLangMap[targetLangCode];
    let targetLangEmote = langCodeEmoteMap[targetLangCode];

    let missingTranslations = objComplement(source, target);
    console.log(`[INFO] Diff for ${sourceLang}${sourceLangeEmote} --- ${targetLang}${targetLangEmote}:\n\n`, JSON.stringify(missingTranslations, null, 2))
    let translations = await openTranslator.translate(missingTranslations, targetLang);
    console.log(`[INFO] Result for ${targetLang} ${targetLangEmote}:\n\n`, JSON.stringify(translations, null, 2))
    let patched = patchObj(target, translations)

    let stringified = JSON.stringify(patched, null, 2);
    let outFile = `${outDir}/${targetLangCode}.json`;
    writeFileSync(outFile, stringified, {encoding: 'utf-8'});
    console.log(`[INFO] Completed writing file: ${outFile}`);
  }
})();
