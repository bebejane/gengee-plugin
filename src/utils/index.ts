export const isDev = document.location.hostname === 'localhost';
export const baseUrl = 'https://social-gen.vercel.app'

export const generateSourceUrl = (template: string, { fields }: { fields: Fields }) => {
  return `${baseUrl}/api/generate?t=${template}&f=${encodeURIComponent(JSON.stringify(fields))}`
}