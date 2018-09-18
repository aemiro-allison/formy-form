import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'formy',
  outputTargets: [
    {
      type: 'dist'
    },
    {
      type: 'www',
      serviceWorker: null
    }
  ]
};
