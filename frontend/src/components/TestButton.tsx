// Student_ID,
// Age,
// Gender,
// Academic_Level,
// Country,
// Avg_Daily_Usage_Hours,
// Most_Used_Platform,
// Affects_Academic_Performance,
// Sleep_Hours_Per_Night,
// Mental_Health_Score,
// Relationship_Status,
// Conflicts_Over_Social_Media

'use client'

import { useRouter, usePathname } from 'next/navigation'
import { preguntas } from '@/utils/preguntas'
import { cn } from '@/lib/utils'

interface BotonSiguienteProps {
  respondido: boolean
}

export default function BotonSiguiente({ respondido }: BotonSiguienteProps) {
  const router = useRouter()
  const pathname = usePathname()

  const actual = pathname.split('/').pop() || ''
  const indiceActual = preguntas.indexOf(actual)
  const siguiente = preguntas[indiceActual + 1]

  const irASiguiente = () => {
    if (!respondido) return
    if (siguiente) {
      router.push(`/testQuests/${siguiente}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={irASiguiente}
        disabled={!respondido}
        aria-disabled={!respondido}
        className={cn(
          'px-6 py-3 rounded-2xl text-lg font-semibold transition-all duration-300 shadow-md',
          'bg-white text-purple-800 hover:bg-purple-200 hover:scale-105',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white'
        )}
      >
        Siguiente →
      </button>
    </div>
  )
}