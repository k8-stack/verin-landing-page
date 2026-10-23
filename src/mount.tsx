import { StrictMode, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import './styles/components.css';
import './styles/sections.css';
import './styles/pages.css';

export function mount(node: ReactNode) {
  createRoot(document.getElementById('root')!).render(<StrictMode>{node}</StrictMode>);
}
