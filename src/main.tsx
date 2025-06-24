import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@unocss/reset/tailwind.css' // CSS reset
import 'virtual:uno.css' // UnoCSS engine
import './index.css' // Your custom styles

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)