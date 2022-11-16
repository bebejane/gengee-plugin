import s from './GenGeeModal.module.scss'
import { RenderModalCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Form, TextField, SelectField } from 'datocms-react-ui';
import { generateSourceUrl } from '../utils';
import { useState, useRef, useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';

export type PropTypes = {
  ctx: RenderModalCtx;
};

export default function GenGeeModal({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters
  const { template } = parameters;
  const json = (parameters.json ? parameters.json : []) as FormItem[]

  const [src, setSrc] = useState<string | undefined>();
  const imageSrc = useDebounce<string | undefined>(src, 400)

  const [form, setForm] = useState(json || []);
  const downloadRef = useRef<HTMLAnchorElement | null>(null)

  const handleChange = (id: string, value: string) => {
    setForm(form.map(el => ({ ...el, value: id === el.id ? value : el.value })))
  }

  const handleDownload = async () => {
    //if (downloadRef.current !== null)
    //downloadRef.current.click()
    console.log(src);

    const blob = await fetch(src as string).then(res => res.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "myImage.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

  }

  const handleSelectImage = async (id: string) => {
    const upload = await ctx.selectUpload({ multiple: false })
    if (upload)
      handleChange(id, upload?.attributes.url)
  }

  useEffect(() => {
    if (template === undefined) return
    const src = generateSourceUrl(template, {
      values: form.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.value }), {})
    })
    setSrc(src)
  }, [form, template])

  return (
    <Canvas ctx={ctx}>
      <div className={s.modal}>
        <div className={s.editor}>
          <figure>
            <img src={imageSrc} />
          </figure>
          <div className={s.config}>
            <Form>
              {form.map(({ type, label, value, id }) => {

                switch (type) {
                  case 'text':
                    return <TextField
                      id={id}
                      name={id}
                      label={label}
                      value={value}
                      onChange={(value) => handleChange(id, value)}
                    />
                  case 'image':
                    return (
                      <div className={s.imageSelector}>
                        <div>{value && <img src={`${value}?w=50`} />}</div>
                        <Button onClick={() => handleSelectImage(id)}>Select image...</Button>
                      </div>
                    )
                  default:
                    return null;
                }
              })}
            </Form>
          </div>
        </div>
        <div className={s.buttons}>
          <Button fullWidth={true} onClick={handleDownload}>Download</Button>
        </div>
        <a
          ref={downloadRef}
          className={s.download}
          href={src}
          download="Fin-bild.png"
          rel="noreferrer"
          target={'_blank'}
        >download</a>
      </div>
    </Canvas>
  );
}