import {PathOrFileDescriptor, readFileSync} from "fs";

export function dirOf(path: string): string {
  return path.slice(0, path.lastIndexOf('/'))
}

export function tryReadFile(path: PathOrFileDescriptor): string | undefined {
  try {
    return readFileSync(path, { encoding: 'utf-8'})
  } catch(err) {
    return undefined
  }
}