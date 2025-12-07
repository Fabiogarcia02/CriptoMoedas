import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Mude esta linha. Adicione as chaves { }:
import { App } from './App.tsx'

import './index.css' // Certifique-se que o CSS global está importado aqui

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)