import { createContext, useContext } from 'react';
import type { FounderContextValue } from './context';

export const FounderContext = createContext<FounderContextValue | null>(null);

export function useFounder() {
  const value = useContext(FounderContext);
  if (!value) throw new Error('useFounder must be used inside FounderProvider');
  return value;
}
