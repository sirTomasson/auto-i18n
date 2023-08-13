import { dirOf } from "./util";

describe('main module', () => {
  test('it returns dir', () => {
    const path: string = `./src/assets/i18n/de.json`
    const dir: string = dirOf(path);

    expect(dir).toEqual('./src/assets/i18n')
  });
});