import { useState } from 'react'
import { FolderOpen, Award, Code } from 'lucide-react'
import { ProjectCard, CertificateCard, SkillBar, EmptyState } from '../../components/ui'
import type { CompanyProfile } from '../../types'
import { useVisitTracker } from '../../hooks/useVisitTracker'
import { useAuthStore } from '../../store'
import { useT } from '../../i18n'

interface CompanyTabsProps {
  profile: CompanyProfile
}


export const CompanyTabs = ({ profile }: CompanyTabsProps) => {
  const [activeTab, setActiveTab] = useState('projects')
  const { token } = useAuthStore()
  const { trackPage } = useVisitTracker(token)
  const { t } = useT()

  const TABS = [
    { id: 'projects',     label: t('projects.title'),     icon: FolderOpen },
    { id: 'certificates', label: t('certificates.title'), icon: Award      },
    { id: 'skills',       label: t('skills.title'),       icon: Code       },
  ]

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    trackPage(tabId) // تسجيل الصفحة التي شاهدها
  }

  // تجميع المهارات حسب الـ category
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
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${activeTab === id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }
            `}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        profile.projects?.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FolderOpen size={48} />}
            title={t('projects.noProjects')}  //
          />
        )
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        profile.certificates?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {profile.certificates.map((cert) => (
              <CertificateCard key={cert.id} {...cert} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Award size={48} />}
            title={t('certificates.title')}
          />
        )
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        profile.skills?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {Object.entries(skillsByCategory).map(([category, skills]) => (
              <div key={category} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-primary-400 uppercase tracking-wider">
                  {category}
                </h3>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <SkillBar key={skill.name} {...skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<Code size={48} />}
            title={t('skills.title')}
          />
        )
      )}
    </div>
  )
}
