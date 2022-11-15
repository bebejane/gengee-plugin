import React from 'react';
import ReactDOM from 'react-dom'
import { connect, IntentCtx, RenderManualFieldExtensionConfigScreenCtx, RenderFieldExtensionCtx, RenderModalCtx } from 'datocms-plugin-sdk';
import { render } from './utils/render';
import ConfigScreen from './entrypoints/ConfigScreen';
import GenGeeConfigScreen from './entrypoints/GenGeeConfigScreen';
import GenGee from './entrypoints/GenGee'
import GenGeeModal from './entrypoints/GenGeeModal'

import 'datocms-react-ui/styles.css';

connect({
  renderConfigScreen(ctx) {
    return render(<ConfigScreen ctx={ctx} />);
  },
  manualFieldExtensions(ctx: IntentCtx) {
    return [
      {
        id: 'gengee',
        name: 'Gen-Gee',
        type: 'editor',
        fieldTypes: ['json'],
        configurable: true
      },
    ];
  },
  renderFieldExtension(fieldExtensionId: string, ctx: RenderFieldExtensionCtx) {
    switch (fieldExtensionId) {
      case 'gengee':
        return render(<GenGee ctx={ctx} />);
    }
  },
  renderManualFieldExtensionConfigScreen(fieldExtensionId: string, ctx: RenderManualFieldExtensionConfigScreenCtx) {
    ReactDOM.render(
      <React.StrictMode>
        <GenGeeConfigScreen ctx={ctx} />
      </React.StrictMode>,
      document.getElementById('root'),
    );
  },
  renderModal(modalId: string, ctx: RenderModalCtx) {
    switch (modalId) {
      case 'gengeeModal':
        return render(<GenGeeModal ctx={ctx} />);
    }
  },
});
