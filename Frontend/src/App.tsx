import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { PageTransition } from './components/ui/PageTransition'
import { HomePage }       from './pages/public/HomePage'
import { CompanyGate }    from './pages/company/CompanyGate'
import { CompanyView }    from './pages/company/CompanyView'
import { AdminLogin }     from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'

function App() {
    const location = useLocation()

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>

                {/* ✅ Public */}
                <Route path="/" element={
                    <PageTransition><HomePage /></PageTransition>
                } />

                {/* ✅ Company */}
                <Route path="/view/:token" element={
                    <PageTransition><CompanyGate /></PageTransition>
                } />
                <Route path="/company/view" element={
                    <PageTransition><CompanyView /></PageTransition>
                } />

                {/* ✅ Admin */}
                <Route path="/admin/login" element={
                    <PageTransition><AdminLogin /></PageTransition>
                } />
                <Route path="/admin/dashboard" element={
                    <PageTransition><AdminDashboard /></PageTransition>
                } />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </AnimatePresence>
    )
}

export default App
