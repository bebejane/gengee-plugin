export const baseUrl = 'https://gengee.vercel.app/api/gengee'

export const generateSourceUrl = (template: string, params: any) => {
  return `${baseUrl}?template=${template}&params=${encodeURIComponent(JSON.stringify(params))}`
}
