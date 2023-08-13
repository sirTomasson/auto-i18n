export function dirOf(path: string): string {
  console.log(path)
  return path.slice(0, path.lastIndexOf('/'))
}