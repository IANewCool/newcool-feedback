'use client'

import { useEffect } from 'react'
import { useT12Init, T12_EVENTS, t12EventBus } from '@newcool/t12-shared'
import { useFeedbackStore } from '@/lib/stores/useFeedbackStore'

export function T12Provider({ children }: { children: React.ReactNode }) {
  useT12Init('feedback')

  const npsMetrics = useFeedbackStore((s) => s.npsMetrics)

  // Emit NPS events when metrics change
  useEffect(() => {
    if (npsMetrics.totalResponses > 0 && t12EventBus.isReady()) {
      // This will be called when store changes, so we use a flag to prevent duplicate emissions
    }
  }, [npsMetrics])

  return <>{children}</>
}
