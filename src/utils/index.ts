export const isDev = document.location.hostname === 'localhost';
export const baseUrl = 'https://social-gen.vercel.app'

export const Base64 = {
  encode: (obj: any): string => btoa(unescape(encodeURIComponent(JSON.stringify(obj)))),
  decode: (str: string): any => JSON.parse(decodeURIComponent(escape(atob(str))))
}

export const generateSourceUrl = (template: any, { fields }: { fields: Fields }) => {
  const { config } = template;
  return `${baseUrl}/api/generate?t=${config.id}&f=${Base64.encode(fields)}`
}