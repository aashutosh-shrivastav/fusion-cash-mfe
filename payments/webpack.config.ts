import { withModuleFederation } from '@nx/module-federation/angular';
import config from './module-federation.config';

/**
 * DTS Plugin is disabled in Nx Workspaces as Nx already provides Typing support for Module Federation
 * The DTS Plugin can be enabled by setting dts: true
 * Learn more about the DTS Plugin here: https://module-federation.io/configure/dts.html
 */
export default async (wConfig) => {
  const mf = await withModuleFederation(config, { dts: false });
  const res = mf(wConfig);
  res.output = {
    ...res.output,
    scriptType: 'text/javascript',
  };
  return res;
};
