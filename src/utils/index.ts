export const isDev = document.location.hostname === 'localhost';
export const baseUrl = 'https://social-gen.vercel.app'

export const generateSourceUrl = (template: any, { fields }: { fields: Fields }) => {
  const { config } = template;
  return `${baseUrl}/api/generate?t=${config.id}&f=${btoa(JSON.stringify(fields))}`
}