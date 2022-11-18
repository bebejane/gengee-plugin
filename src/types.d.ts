type Fields = {
  [key: string]: {
    label: string,
    value: string,
    type: 'text' | 'image',
  }
}

type ConfigParameters = {
  template: string | undefined,
  buttonLabel: string,
  width: string,
  height: string
};
