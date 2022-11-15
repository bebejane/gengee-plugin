import s from './GenGeeConfigScreen.module.scss'
import cn from 'classnames'
import { RenderManualFieldExtensionConfigScreenCtx } from 'datocms-plugin-sdk';
import { Canvas, Form, TextField, SwitchField } from 'datocms-react-ui';
import { useCallback, useEffect, useRef, useState } from 'react';

export type PropTypes = {
  ctx: RenderManualFieldExtensionConfigScreenCtx;
};

export default function GenGeeConfigScreen({ ctx }: PropTypes) {

  const [validJson, setValidJson] = useState(true)
  const jsonRef = useRef<HTMLTextAreaElement | null>(null)
  const [formValues, setFormValues] = useState<Partial<ConfigParameters>>(ctx.parameters);

  const saveParameter = useCallback((field: string, value: string | boolean) => {
    const newParameters = { ...formValues, [field]: value };
    setFormValues(newParameters);
    ctx.setParameters(newParameters);
    console.log('saved');

  }, [formValues, setFormValues, ctx]);

  const handleJsonText = (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (evt.key !== 'Tab')
      return

    evt.preventDefault();
    const target = evt.target as HTMLInputElement;
    const start = target.selectionStart === null ? target.value.length : target.selectionStart;
    const end = target.selectionEnd === null ? 0 : target.selectionEnd;
    target.value = target.value.substring(0, start) + "\t" + target.value.substring(end);
    target.selectionEnd = start + 1;

  }

  useEffect(() => {
    if (!formValues.json) return

    try {
      JSON.parse(formValues.json);
      setValidJson(true)
      saveParameter('json', formValues.json)
    } catch (err) {
      setValidJson(false)
    }
  }, [formValues.json])

  return (
    <Canvas ctx={ctx}>
      <Form>
        <TextField
          id="template"
          name="template"
          label="Template"
          value={formValues.template}
          onChange={(template) => saveParameter('template', template)}
        />
        <TextField
          id="button-label"
          name="button-label"
          label="Button label"
          value={formValues.buttonLabel}
          onChange={(value) => saveParameter('buttonLabel', value)}
        />
        <label htmlFor="json">Parameters</label>
        <textarea
          className={cn(s.config, !validJson && s.error)}
          name="json"
          id="json"
          cols={30}
          rows={10}
          value={formValues.json}
          defaultValue="{}"
          spellCheck={false}
          onKeyDown={handleJsonText}
          onChange={({ target: { value: json } }) => setFormValues({ ...formValues, json })}
        />
      </Form>
    </Canvas>
  );
}