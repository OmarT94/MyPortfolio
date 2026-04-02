import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageSpinner } from '../../components/ui'
import { useProfileStore, useAuthStore } from '../../store'
import { CompanyHeader } from './CompanyHeader'
import { CompanyTabs }   from './CompanyTabs'

// Navbar بسيط خاص بالشركة — بدون أي أزرار Admin
const CompanyNavbar = () => (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
            <span className="text-lg font-bold text-slate-100">{'<Portfolio />'}</span>
        </div>
    </header>
)

export const CompanyView = () => {
    const navigate = useNavigate()
    const { role } = useAuthStore()
    const { companyProfile, isLoading, fetchCompany } = useProfileStore()

    useEffect(() => {
        if (role !== 'COMPANY') {
            navigate('/', { replace: true })
            return
        }
        fetchCompany()
    }, [role, navigate, fetchCompany])

    if (isLoading || !companyProfile) return <PageSpinner />

    return (
        <div className="min-h-screen bg-slate-950">
            <CompanyNavbar />

            <main className="pt-16">
                <div className="bg-primary-600/10 border-b border-primary-500/20 py-2 px-4 text-center">
                    <p className="text-xs text-primary-300">

                    </p>
                </div>

                <CompanyHeader profile={companyProfile} />
                <CompanyTabs   profile={companyProfile} />

                <footer className="border-t border-slate-800 py-6 text-center text-sm text-slate-600">
                    <p>© {new Date().getFullYear()} {companyProfile.fullName}</p>
                </footer>
            </main>
        </div>
    )
}