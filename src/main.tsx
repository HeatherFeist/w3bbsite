
import { createRoot } from 'react-dom/client'
import { installAnalytics } from '@/lib/analytics'
import App from './App.tsx'
import './index.css'

installAnalytics()

// Remove dark mode class addition
createRoot(document.getElementById("root")!).render(<App />);
