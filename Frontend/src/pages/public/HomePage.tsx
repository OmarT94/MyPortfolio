import { useEffect } from 'react'
import { Layout } from '../../components/layout'
import { HeroSkeleton } from '../../components/ui'
import { useProfileStore } from '../../store'
import { HeroSection }    from './HeroSection'
import { AboutSection }   from './AboutSection'
import { ContactSection } from './ContactSection'

export const HomePage = () => {
    const { publicProfile, isLoading, fetchPublic } = useProfileStore()

    useEffect(() => {
        fetchPublic()
    }, [fetchPublic])

    if (isLoading || !publicProfile) return (
        <Layout>
            <HeroSkeleton />
        </Layout>
    )

    return (
        <Layout>
            <div className="divide-y divide-slate-800/50">
                <HeroSection    profile={publicProfile} />
                <AboutSection   profile={publicProfile} />
                <ContactSection profile={publicProfile} />
            </div>
            <footer className="border-t border-slate-800 py-8 text-center text-sm text-slate-600">
                <p>© {new Date().getFullYear()} {publicProfile.fullName} </p>
            </footer>
        </Layout>
    )
}
