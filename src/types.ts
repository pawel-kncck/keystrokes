import type { ComponentType, ReactNode } from 'react';

export type AtomicFunction = {
  id: string;
  title: string;
  blurb: string;
  description: ReactNode;
  code: string;
  Demo: ComponentType;
};

export type FunctionGroup = {
  id: string;
  label: string;
  items: AtomicFunction[];
};
