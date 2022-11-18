export const isDev = document.location.hostname === 'localhost';
export const baseUrl = 'https://social-gen.vercel.app'

export const generateSourceUrl = (template: string, { fields, dimensions }: { fields: Fields, dimensions?: { width: string, height: string } }) => {
  const { width, height } = dimensions || {}
  return `${baseUrl}/api/generate?t=${template}&f=${encodeURIComponent(JSON.stringify(fields))}${dimensions ? `&w=${width}&h=${height}` : ''}`
}