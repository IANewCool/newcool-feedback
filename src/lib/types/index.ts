export interface Survey {
  id: string
  title: string
  description: string
  questions: SurveyQuestion[]
  createdAt: Date
  expiresAt?: Date
  isActive: boolean
  targetAudience?: string[]
}

export interface SurveyQuestion {
  id: string
  type: 'rating' | 'text' | 'multiple_choice' | 'nps' | 'emoji'
  question: string
  required: boolean
  options?: string[]
  minLabel?: string
  maxLabel?: string
}

export interface SurveyResponse {
  id: string
  surveyId: string
  userId?: string
  answers: Record<string, any>
  submittedAt: Date
  metadata?: {
    userAgent?: string
    source?: string
  }
}

export interface NPSScore {
  id: string
  userId?: string
  score: number // 0-10
  feedback?: string
  category: 'detractor' | 'passive' | 'promoter'
  createdAt: Date
  context?: string
}

export interface FeedbackItem {
  id: string
  userId?: string
  type: 'suggestion' | 'bug' | 'praise' | 'question'
  title: string
  content: string
  status: 'new' | 'reviewed' | 'in_progress' | 'resolved' | 'closed'
  votes: number
  createdAt: Date
  tags?: string[]
}

export interface NPSMetrics {
  totalResponses: number
  promoters: number
  passives: number
  detractors: number
  npsScore: number // -100 to 100
  trend: 'up' | 'down' | 'stable'
}
