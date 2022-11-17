export const isDev = document.location.hostname === 'localhost';
export const baseUrl = 'https://social-gen.vercel.app/api/generate'

export const generateSourceUrl = (template: string, params: any, dimensions?: { width: string, height: string }) => {
  const { width, height } = dimensions || {}
  return `${baseUrl}?t=${template}&p=${encodeURIComponent(JSON.stringify(params))}${dimensions ? `&w=${width}&h=${height}` : ''}`
}