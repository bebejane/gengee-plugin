import s from './GenGeeModal.module.scss'
import { RenderModalCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Form, TextField } from 'datocms-react-ui';
import { generateSourceUrl } from '../utils';
import { useState, useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import Loader from "react-spinners/MoonLoader";


export type PropTypes = {
  ctx: RenderModalCtx;
};

export default function GenGeeModal({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters
  const { template, width, height } = parameters;

  const json = (parameters.json ? parameters.json : []) as FormItem[]
  const [src, setSrc] = useState<string | undefined>();
  const imageSrc = useDebounce<string | undefined>(src, 400)
  const [form, setForm] = useState(json || []);
  const [loading, setLoading] = useState(false)

  const handleChange = (id: string, value: string) => {
    const newForm = form.map(el => ({ ...el, value: id === el.id ? value : el.value }))
    setForm(newForm)
  }
  const handleDownload = async () => {
    const blob = await fetch(src as string).then(res => res.blob());
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = parameters.buttonLabel ? `${parameters.buttonLabel}.png` : 'Image.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const handleSelectImage = async (id: string) => {
    const upload = await ctx.selectUpload({ multiple: false })
    if (!upload) return
    if (!upload.attributes.mime_type?.includes('image'))
      return ctx.alert('File is not an image!')

    handleChange(id, upload?.attributes.url)
  }

  useEffect(() => {
    if (template === undefined)
      return

    const src = generateSourceUrl(template, {
      values: form.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.value }), {})
    }, { width, height })

    setLoading(true)
    setSrc(src)

  }, [form, template, width, height])


  return (
    <Canvas ctx={ctx}>
      <div className={s.modal}>
        <div className={s.editor}>
          <figure>
            <img src={imageSrc} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
            {loading && <div className={s.loading}><Loader color={'#ffffff'} size={20} /></div>}
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
                        <div>{value && <img alt="thumb" src={`${value}?w=50`} />}</div>
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
          <Button fullWidth={true} onClick={handleDownload} disabled={loading}>
            Download
          </Button>
          <Button fullWidth={true} onClick={() => ctx.resolve(form)}>
            Save
          </Button>
        </div>
      </div>
    </Canvas>
  );
}