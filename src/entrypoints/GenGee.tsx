import s from './GenGee.module.scss'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function GenGee({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters;
  const { template, json, width, height, buttonLabel } = parameters

  const handleOpenModal = async () => {
    try {

      if (json === undefined || !template || !width || !height)
        throw new Error('Plugin not configured correctly!');

      const savedJson = ctx.item?.attributes[ctx.field.attributes.api_key] as string
      const jsonData = JSON.parse(savedJson || parameters.json || '[]')

      const result = await ctx.openModal({
        id: 'gengeeModal',
        title: 'Social image',
        width: 'xl',
        closeDisabled: false,
        parameters: { ...parameters, json: jsonData }
      });

      if (result)
        ctx.setFieldValue(ctx.field.attributes.api_key, JSON.stringify(result))

    } catch (err) {
      ctx.alert((err as Error).message)
    }
  }

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={handleOpenModal}>
        {buttonLabel || 'Generate Image'}
      </Button>
    </Canvas>
  );
}