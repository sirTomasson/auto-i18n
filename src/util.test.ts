import {dirOf, tryReadFile} from "./util";

describe('main module', () => {
  test('it returns dir', () => {
    const path: string = `./src/assets/i18n/de.json`
    const dir: string = dirOf(path);

    expect(dir).toEqual('./src/assets/i18n')
  });

  test('it returns undefined', () => {
    const result = tryReadFile('./path/to/file/that/does/not/exist.txt');

    expect(result).toBeUndefined()
  });
});