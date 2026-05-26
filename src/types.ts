import type { ComponentType, ReactNode } from 'react';
import type { Reducer } from './lib/editor';
import type { TraceFn } from './lib/trace';

export type AtomicFunction = {
  id: string;
  title: string;
  blurb: string;
  description: ReactNode;
  code: string;
  Demo: ComponentType;
  /**
   * Optional step-through metadata. When both `trace` and `reducer` are
   * present, the function page exposes a "step through" toggle that
   * pauses the demo and walks the algorithm line by line.
   */
  trace?: TraceFn;
  reducer?: Reducer;
  demoConfig?: { text?: string; cursor?: number; hint?: string };
};

export type FunctionGroup = {
  id: string;
  label: string;
  items: AtomicFunction[];
};
