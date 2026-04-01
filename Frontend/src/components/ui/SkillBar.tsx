import type { Skill } from '../../types'

const levelWidth = {
  Beginner:     'w-1/3',
  Intermediate: 'w-2/3',
  Advanced:     'w-full',
}

const levelColor = {
  Beginner:     'bg-amber-500',
  Intermediate: 'bg-primary-500',
  Advanced:     'bg-emerald-500',
}

export const SkillBar = ({ name, level }: Skill) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-sm">
      <span className="text-slate-200 font-medium">{name}</span>
      <span className="text-slate-500">{level}</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${levelWidth[level]} ${levelColor[level]}`} />
    </div>
  </div>
)
