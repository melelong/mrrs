export { adminApi } from './api'
export function svgToBase64(str: string): string {
  return `data:image/svg+xml;base64,${btoa(str)}`
}
export { crypto } from '@repo/utils/es'
