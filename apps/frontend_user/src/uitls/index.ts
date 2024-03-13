export { userApi } from './api'
export function svgToBase64(str: string): string {
  return `data:image/svg+xml;base64,${btoa(str)}`
}
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (this: any, ...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return function (...args: Parameters<T>): void {
    clearTimeout(timeoutId)

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
export type Recordable<T = any> = Record<string, T>
