type Fields = {
  [key: string]: {
    label: string,
    value: string,
    type: 'text' | 'image' | 'select',
    options?: [{
      label: string,
      value: string
    }]
  }
}

type ConfigParameters = {
  template: string | undefined,
  buttonLabel: string
};
