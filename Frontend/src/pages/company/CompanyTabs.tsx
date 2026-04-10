import { useState } from 'react'
import { FolderOpen, Award, Code } from 'lucide-react'
import { ProjectCard, CertificateCard, SkillBar, EmptyState } from '../../components/ui'
import { StaggerContainer, StaggerItem } from '../../components/ui/AnimatedSection'
import type { CompanyProfile } from '../../types'
import { useVisitTracker } from '../../hooks/useVisitTracker'
import { useT } from '../../i18n'

interface CompanyTabsProps {
  profile: CompanyProfile
}

export const CompanyTabs = ({ profile }: CompanyTabsProps) => {
  const [activeTab, setActiveTab] = useState('projects')

  // ✅ magic-token = der kurze 16-Zeichen Token (nicht der JWT!)
  const companyToken = sessionStorage.getItem('magic-token')
  const { trackPage } = useVisitTracker(companyToken)

  const { t } = useT()

  const TABS = [
    { id: 'projects',     label: t('projects.title'),     icon: FolderOpen },
    { id: 'certificates', label: t('certificates.title'), icon: Award      },
    { id: 'skills',       label: t('skills.title'),       icon: Code       },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    trackPage(tabId)
  }

  const skillsByCategory = profile.skills?.reduce((acc, skill) => {
    const cat = skill.category || 'أخرى'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {} as Record<string, typeof profile.skills>)

  return (
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Tab Buttons */}
        <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-8 w-fit">
          {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => handleTabChange(id)}
                      className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === id ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
            `}>
                <Icon size={15} />
                {label}
              </button>
          ))}
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
            profile.projects?.length > 0 ? (
                <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profile.projects.map((project) => (
                      <StaggerItem key={project.id}>
                        <ProjectCard {...project} />
                      </StaggerItem>
                  ))}
                </StaggerContainer>
            ) : (
                <EmptyState icon={<FolderOpen size={48} />} title={t('projects.noProjects')} />
            )
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
            profile.certificates?.length > 0 ? (
                <StaggerContainer className="grid md:grid-cols-2 gap-4">
                  {profile.certificates.map((cert) => (
                      <StaggerItem key={cert.id}>
                        <CertificateCard {...cert} />
                      </StaggerItem>
                  ))}
                </StaggerContainer>
            ) : (
                <EmptyState icon={<Award size={48} />} title={t('certificates.title')} />
            )
        )}

        {/* Skills Tab */}
        {activeTab === 'skills' && (
            profile.skills?.length > 0 ? (
                <StaggerContainer className="grid md:grid-cols-2 gap-8">
                  {Object.entries(skillsByCategory).map(([category, skills]) => (
                      <StaggerItem key={category}>
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                          <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
                            {category}
                          </h3>
                          <div className="space-y-3">
                            {skills.map((skill) => (
                                <SkillBar key={skill.name} {...skill} />
                            ))}
                          </div>
                        </div>
                      </StaggerItem>
                  ))}
                </StaggerContainer>
            ) : (
                <EmptyState icon={<Code size={48} />} title={t('skills.title')} />
            )
        )}
      </div>
  )
}
