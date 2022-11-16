import s from './GenGee.module.scss'
import { RenderFieldExtensionCtx } from 'datocms-plugin-sdk';
import { Canvas, Button } from 'datocms-react-ui';

type PropTypes = {
  ctx: RenderFieldExtensionCtx;
};

export default function GenGee({ ctx }: PropTypes) {

  const parameters = ctx.parameters as ConfigParameters;

  const handleOpenModal = async () => {

    try {

      if (parameters.json === undefined || !parameters.template || !parameters.width || !parameters.height)
        throw new Error('Plugin not configured correctly!');

      const json = parameters.json !== undefined ? JSON.parse(parameters.json) : []

      const result = await ctx.openModal({
        id: 'gengeeModal',
        title: 'Social image',
        width: 'xl',
        parameters: { ...parameters, json }
      });

      ctx.notice(result as string);
    } catch (err) {
      ctx.alert((err as Error).message)
    }
  }

  return (
    <Canvas ctx={ctx}>
      <Button type="button" onClick={handleOpenModal}>
        {parameters.buttonLabel || 'Generate'}
      </Button>
    </Canvas>
  );
}