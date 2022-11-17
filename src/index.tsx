import React from 'react';
import ReactDOM from 'react-dom'
import {
  connect,
  IntentCtx,
  RenderManualFieldExtensionConfigScreenCtx,
  RenderFieldExtensionCtx,
  RenderModalCtx
} from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import SocialGenConfigScreen from './entrypoints/SocialGenConfigScreen';
import SocialGen from './entrypoints/SocialGen'
import SocialGenModal from './entrypoints/SocialGenModal'
import 'datocms-react-ui/styles.css';
import { isDev } from './utils'

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'social-gen',
        name: 'Social-Gen' + (isDev ? ' (dev)' : ''),
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true
      },
    ];
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'social-gen':
        return render(<SocialGen ctx={ctx} />);
    }
  },
  renderManualFieldExtensionConfigScreen(fieldExtensionId: string, ctx: RenderManualFieldExtensionConfigScreenCtx) {
    ReactDOM.render(
      <React.StrictMode>
        <SocialGenConfigScreen ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case 'socialGenModal':
        return render(<SocialGenModal ctx={ctx} />);
    }
  },
});
