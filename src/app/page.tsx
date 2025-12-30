'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { NPSWidget } from '@/components/NPS/NPSWidget'
import { FeedbackForm } from '@/components/Feedback/FeedbackForm'
import { SurveyCard } from '@/components/Survey/SurveyCard'
import { T12Provider } from '@/components/T12Provider'
import { useFeedbackStore } from '@/lib/stores/useFeedbackStore'
import type { Survey } from '@/lib/types'

const demoSurvey: Survey = {
  id: 'demo-survey',
  title: 'Experiencia NewCool',
  description: 'Ayudanos a entender como mejorar tu experiencia',
  isActive: true,
  createdAt: new Date(),
  questions: [
    {
      id: 'q1',
      type: 'emoji',
      question: '¿Como te sientes usando NewCool?',
      required: true
    },
    {
      id: 'q2',
      type: 'multiple_choice',
      question: '¿Cual es tu funcionalidad favorita?',
      required: true,
      options: ['Musica educativa', 'Mini juegos', 'Karaoke', 'Dashboard evolutivo', 'Comunidad']
    },
    {
      id: 'q3',
      type: 'text',
      question: '¿Que te gustaria ver en NewCool?',
      required: false
    }
  ]
}

type Tab = 'nps' | 'feedback' | 'survey' | 'metrics'

export default function FeedbackDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('nps')
  const { submitNPS, submitFeedback, submitSurveyResponse, npsMetrics, feedbackItems } = useFeedbackStore()

  const tabs = [
    { id: 'nps', label: 'NPS', emoji: '📊' },
    { id: 'feedback', label: 'Feedback', emoji: '📝' },
    { id: 'survey', label: 'Encuesta', emoji: '📋' },
    { id: 'metrics', label: 'Metricas', emoji: '📈' },
  ]

  return (
    <T12Provider>
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900/20 to-cyan-900/20">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900/80 via-emerald-900/40 to-cyan-900/40 backdrop-blur-xl border-b border-emerald-500/20 p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl"
            >
              📬
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                NewCool Feedback
              </h1>
              <p className="text-gray-400 mt-1">
                Tu voz importa | T12-COMMUNITY
              </p>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
              }`}
            >
              <span>{tab.emoji}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'nps' && (
            <NPSWidget
              onSubmit={(score, feedback) => submitNPS(score, feedback, 'dashboard')}
            />
          )}

          {activeTab === 'feedback' && (
            <FeedbackForm
              onSubmit={(data) => submitFeedback({
                type: data.type as any,
                title: data.title,
                content: data.content,
                tags: data.tags
              })}
            />
          )}

          {activeTab === 'survey' && (
            <SurveyCard
              survey={demoSurvey}
              onComplete={(answers) => submitSurveyResponse(demoSurvey.id, answers)}
            />
          )}

          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* NPS Metrics */}
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📊</span> Net Promoter Score
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-700/30 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-white">{npsMetrics.npsScore}</div>
                    <div className="text-xs text-gray-400">NPS Score</div>
                  </div>
                  <div className="bg-green-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-green-400">{npsMetrics.promoters}</div>
                    <div className="text-xs text-gray-400">Promotores</div>
                  </div>
                  <div className="bg-yellow-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-yellow-400">{npsMetrics.passives}</div>
                    <div className="text-xs text-gray-400">Pasivos</div>
                  </div>
                  <div className="bg-red-500/20 rounded-xl p-4 text-center">
                    <div className="text-3xl font-black text-red-400">{npsMetrics.detractors}</div>
                    <div className="text-xs text-gray-400">Detractores</div>
                  </div>
                </div>

                <div className="text-center text-gray-400 text-sm">
                  Total respuestas: {npsMetrics.totalResponses}
                </div>
              </div>

              {/* Recent Feedback */}
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>📝</span> Feedback Reciente
                </h3>

                {feedbackItems.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No hay feedback todavia. ¡Se el primero!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedbackItems.slice(0, 5).map((item) => (
                      <div key={item.id} className="bg-gray-700/30 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span>
                            {item.type === 'suggestion' && '💡'}
                            {item.type === 'bug' && '🐛'}
                            {item.type === 'praise' && '🎉'}
                            {item.type === 'question' && '❓'}
                          </span>
                          <span className="font-medium text-white">{item.title}</span>
                          <span className="text-xs text-gray-500 ml-auto">{item.status}</span>
                        </div>
                        <p className="text-sm text-gray-400">{item.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>NewCool Feedback | T12-COMMUNITY | Tu voz importa</p>
      </footer>
    </div>
    </T12Provider>
  )
}
