type FormItem = {
  id: string,
  label: string,
  value: string,
  type: 'text' | 'image',
}

type ConfigParameters = {
  template: string | undefined,
  json: string | undefined,
  buttonLabel: string,
  width: string,
  height: string
};
