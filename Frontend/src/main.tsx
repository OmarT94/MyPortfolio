
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { initI18n } from './i18n'
import './index.css'

// تطبيق اتجاه الصفحة عند التحميل
initI18n()

ReactDOM.createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
        <Toaster
            position="top-right"
            toastOptions={{
                duration: 4000,
                style: { background: '#1e293b', color: '#f8fafc' },
            }}
        />
    </BrowserRouter>
)
