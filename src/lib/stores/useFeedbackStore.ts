import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { t12EventBus, T12_EVENTS } from '@newcool/t12-shared'
import type { NPSSubmittedPayload, FeedbackSubmittedPayload } from '@newcool/t12-shared'
import type { NPSScore, FeedbackItem, SurveyResponse, NPSMetrics } from '@/lib/types'

interface FeedbackState {
  // NPS
  npsScores: NPSScore[]
  npsMetrics: NPSMetrics

  // Feedback
  feedbackItems: FeedbackItem[]

  // Survey Responses
  surveyResponses: SurveyResponse[]

  // Actions
  submitNPS: (score: number, feedback?: string, context?: string) => void
  submitFeedback: (item: Omit<FeedbackItem, 'id' | 'status' | 'votes' | 'createdAt'>) => void
  submitSurveyResponse: (surveyId: string, answers: Record<string, any>) => void
  voteFeedback: (feedbackId: string) => void
  calculateNPSMetrics: () => NPSMetrics
}

const calculateNPSCategory = (score: number): 'detractor' | 'passive' | 'promoter' => {
  if (score <= 6) return 'detractor'
  if (score <= 8) return 'passive'
  return 'promoter'
}

export const useFeedbackStore = create<FeedbackState>()(
  persist(
    (set, get) => ({
      npsScores: [],
      npsMetrics: {
        totalResponses: 0,
        promoters: 0,
        passives: 0,
        detractors: 0,
        npsScore: 0,
        trend: 'stable'
      },
      feedbackItems: [],
      surveyResponses: [],

      submitNPS: (score, feedback, context) => {
        const npsEntry: NPSScore = {
          id: `nps-${Date.now()}`,
          score,
          feedback,
          context,
          category: calculateNPSCategory(score),
          createdAt: new Date()
        }

        set((state) => {
          const newScores = [...state.npsScores, npsEntry]
          const newMetrics = get().calculateNPSMetrics()

          // Emit T12 event for cross-module communication
          if (t12EventBus.isReady()) {
            const payload: NPSSubmittedPayload = {
              score,
              category: context || 'general',
              comment: feedback,
              npsMetrics: {
                promoters: newMetrics.promoters,
                passives: newMetrics.passives,
                detractors: newMetrics.detractors,
                score: newMetrics.npsScore
              }
            }
            t12EventBus.publish(T12_EVENTS.NPS_SUBMITTED, payload)
          }

          return {
            npsScores: newScores,
            npsMetrics: newMetrics
          }
        })
      },

      submitFeedback: (item) => {
        const feedbackEntry: FeedbackItem = {
          ...item,
          id: `fb-${Date.now()}`,
          status: 'new',
          votes: 0,
          createdAt: new Date()
        }

        set((state) => ({
          feedbackItems: [feedbackEntry, ...state.feedbackItems]
        }))

        // Emit T12 event for cross-module communication
        if (t12EventBus.isReady()) {
          const payload: FeedbackSubmittedPayload = {
            feedbackId: feedbackEntry.id,
            type: item.type,
            title: item.title
          }
          t12EventBus.publish(T12_EVENTS.FEEDBACK_SUBMITTED, payload)
        }
      },

      submitSurveyResponse: (surveyId, answers) => {
        const response: SurveyResponse = {
          id: `sr-${Date.now()}`,
          surveyId,
          answers,
          submittedAt: new Date()
        }

        set((state) => ({
          surveyResponses: [...state.surveyResponses, response]
        }))
      },

      voteFeedback: (feedbackId) => {
        set((state) => ({
          feedbackItems: state.feedbackItems.map((item) =>
            item.id === feedbackId ? { ...item, votes: item.votes + 1 } : item
          )
        }))
      },

      calculateNPSMetrics: () => {
        const scores = get().npsScores
        if (scores.length === 0) {
          return {
            totalResponses: 0,
            promoters: 0,
            passives: 0,
            detractors: 0,
            npsScore: 0,
            trend: 'stable' as const
          }
        }

        const promoters = scores.filter((s) => s.category === 'promoter').length
        const passives = scores.filter((s) => s.category === 'passive').length
        const detractors = scores.filter((s) => s.category === 'detractor').length
        const total = scores.length

        const npsScore = Math.round(((promoters - detractors) / total) * 100)

        return {
          totalResponses: total,
          promoters,
          passives,
          detractors,
          npsScore,
          trend: 'stable' as const
        }
      }
    }),
    {
      name: 'newcool-feedback-storage'
    }
  )
)
