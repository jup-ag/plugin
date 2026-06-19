import { init as ogInit, resume, close, appProps, syncProps } from './library';
import { IInit, FormProps, WidgetPosition, WidgetSize, SwapMode, DEFAULT_EXPLORER, JupiterPlugin } from './types';
import { IForm, QuoteResponse, SwapResult, SwappingStatus } from './contexts/SwapContext';
import { Screens } from './contexts/ScreenProvider';

import { RenderJupiter } from '.';

async function init(props: IInit) {
  // Populate Jupiter object into window object
  (window as any).Jupiter = { init, resume, close, appProps, syncProps };
  // Populate JupiterRenderer into window object
  (window as any).JupiterRenderer = {
    RenderJupiter: RenderJupiter,
  };

  // Call original init function
  await ogInit(props);
}

// Runtime exports
export { init, resume, close, appProps, syncProps };

// Type exports for TypeScript consumers
export type {
  // Main configuration types
  IInit,
  FormProps,
  JupiterPlugin,
  // Display options
  WidgetPosition,
  WidgetSize,
  SwapMode,
  DEFAULT_EXPLORER,
  // Callback types
  IForm,
  QuoteResponse,
  SwapResult,
  SwappingStatus,
  Screens,
};
