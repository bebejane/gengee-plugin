import s from './SocialGenModal.module.scss'
import { RenderModalCtx } from 'datocms-plugin-sdk';
import { Canvas, Button, Form, TextField } from 'datocms-react-ui';
import { baseUrl, generateSourceUrl } from '../utils';
import { useState, useEffect } from 'react';
import { useDebounce } from 'usehooks-ts';
import Loader from "react-spinners/MoonLoader";

export type PropTypes = {
  ctx: RenderModalCtx;
};

export default function SocialGenModal({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters & { fields: Fields | undefined }
  const { template, width, height } = parameters;
  const [src, setSrc] = useState<string | undefined>();
  const imageSrc = useDebounce<string | undefined>(src, 400)
  const [fields, setFields] = useState<Fields | undefined>();
  const dFields: Fields | undefined = useDebounce(fields, 400)

  const [loading, setLoading] = useState(false)

  const handleChange = (id: string, value: string) => {
    if (fields === undefined) return
    setFields({ ...fields, [id]: { ...fields[id], value } })
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
    if (!upload)
      return
    if (!upload.attributes.mime_type?.includes('image'))
      return ctx.alert('File is not an image!')

    handleChange(id, upload?.attributes.url)
  }

  useEffect(() => {
    if (template === undefined || dFields === undefined)
      return

    const src = generateSourceUrl(template, { fields: dFields, dimensions: { width, height } })

    setLoading(true)
    setSrc(src)

  }, [dFields, template, width, height])


  useEffect(() => {

    (async () => {
      try {
        const templates: any[] = await (await fetch(`${baseUrl}/api/template/list`)).json()
        const t = templates.find(t => t.config.id === template)

        if (!t)
          return ctx.alert(`Template "${template}" not found!"`)

        const mergedFields: Fields = {}

        Object.keys(t.config.fields).forEach((k) => {
          mergedFields[k] = { ...t.config.fields[k], ...parameters.fields?.[k] }
        })

        setFields(mergedFields)
      } catch (err) {
        ctx.alert((err as Error).message)
      }
    })()
  }, [template, setFields, ctx, parameters])


  return (
    <Canvas ctx={ctx}>
      <div className={s.modal}>
        <div className={s.editor}>
          <figure>
            <img src={imageSrc} onLoad={() => setLoading(false)} onError={() => setLoading(false)} />
            {loading && <div className={s.loading}><Loader color={'#ffffff'} size={20} /></div>}
          </figure>
          <div className={s.fields}>
            <Form>
              {fields && Object.keys(fields).map(id => {
                const { type, label, value } = fields[id]

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
          <Button fullWidth={true} onClick={() => ctx.resolve(fields)}>
            Save
          </Button>
        </div>
      </div>
    </Canvas>
  );
}