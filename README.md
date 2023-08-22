# 🤖🏳️‍🌈AUTO i18n
Automated i18n translations from one input file, using OpenAI's GPT.

## USAGE

```
npm add --save-dev @sirtomasson/auto-i18n
```
Set `OPENAI_API_KEY=<your-api-key>` in `.env`.

Then run:
```
npm auto-i18n <path-to-i18n-input-file> <path-to-output-dir>
```
Where `<path-to-i18n-input-file>` is required and `<path-to-output-dir>` is optional; otherwise the directory of `<path-to-i18n-input-file>` is used.

For example: `input-file` is `./assets/i18n/en.json` then `output-dir` is `./assets/i18n`.

Be sure to specify an output dir if you don't the original files to be overwritten.

## RUN
To run locally:
```
npm dev <path-to-i18n-input-file> <path-to-output-dir>
```
## BUILD
To compile:
```
npm run build
```
## PUB
```
npm publish --access=public
```

## TODO

- [ ] Add more supported languages
- [ ] Allow user to set which OpenAI model is being used