import { Eye, Shield, AlertTriangle, Users } from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import type { ComponentType } from 'react'

const ICONS: Record<string, ComponentType<LucideProps>> = { Eye, Shield, AlertTriangle, Users }

function getIcon(name?: string | null): ComponentType<LucideProps> {
  return (name && ICONS[name]) || Shield
}

export default function ServiceHero({
  name,
  description,
  iconName,
  gradient,
}: {
  name: string
  description: string
  iconName?: string
  gradient?: string
}) {
  const Icon = getIcon(iconName)
  const color = gradient || 'from-blue-500 to-purple-600'

  return (
    <section className="relative bg-[#111318] py-20">
      <div className="container-cyna">
        <div className="flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center mb-6`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{name}</h1>
          {description && (
            <p className="text-lg text-gray-300 max-w-3xl">{description}</p>
          )}
        </div>
      </div>
    </section>
  )
}
