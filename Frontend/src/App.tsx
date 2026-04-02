import { Routes, Route, Navigate } from 'react-router-dom'
import { HomePage }    from './pages/public/HomePage'
import { CompanyGate } from './pages/company/CompanyGate'
import { CompanyView } from './pages/company/CompanyView'
import { AdminLogin }  from './pages/admin/AdminLogin'
import {AdminDashboard} from './pages/admin/AdminDashboard'

function App() {
    return (
        <Routes>
            <Route path="/"                element={<HomePage />} />
            <Route path="/view/:token"     element={<CompanyGate />} />
            <Route path="/company/view"    element={<CompanyView />} />
            <Route path="/admin/login"     element={<AdminLogin />} />
            <Route path="/admin/dashboard"     element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default App