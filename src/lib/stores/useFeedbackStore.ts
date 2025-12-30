import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
          return {
            npsScores: newScores,
            npsMetrics: get().calculateNPSMetrics()
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
