'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import type { Survey, SurveyQuestion } from '@/lib/types'

interface SurveyCardProps {
  survey: Survey
  onComplete: (answers: Record<string, any>) => void
}

export function SurveyCard({ survey, onComplete }: SurveyCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [completed, setCompleted] = useState(false)

  const question = survey.questions[currentQuestion]
  const progress = ((currentQuestion + 1) / survey.questions.length) * 100

  const handleAnswer = (value: any) => {
    const newAnswers = { ...answers, [question.id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < survey.questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300)
    } else {
      setCompleted(true)
      onComplete(newAnswers)
    }
  }

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-8 text-center border border-purple-500/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          🎉
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Encuesta completada!</h3>
        <p className="text-gray-400">Gracias por tomarte el tiempo de responder.</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">{survey.title}</h3>
        <p className="text-sm text-gray-400">{survey.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Pregunta {currentQuestion + 1} de {survey.questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          />
        </div>
      </div>

      {/* Question */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="mb-8"
      >
        <h4 className="text-lg font-medium text-white mb-6">{question.question}</h4>

        {/* Rating Question */}
        {question.type === 'rating' && (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <motion.button
                key={rating}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(rating)}
                className="w-12 h-12 rounded-xl bg-gray-700/50 hover:bg-gradient-to-r hover:from-yellow-500 hover:to-orange-500 text-2xl transition-all duration-200"
              >
                {'⭐'.repeat(rating > 3 ? 1 : 0) || '☆'}
              </motion.button>
            ))}
          </div>
        )}

        {/* Emoji Question */}
        {question.type === 'emoji' && (
          <div className="flex justify-center gap-4">
            {['😞', '😐', '🙂', '😊', '🤩'].map((emoji, i) => (
              <motion.button
                key={emoji}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAnswer(i + 1)}
                className="w-14 h-14 rounded-xl bg-gray-700/50 hover:bg-gray-600/50 text-3xl transition-all duration-200"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
        )}

        {/* Multiple Choice Question */}
        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className="w-full p-4 text-left bg-gray-700/50 hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-purple-500/20 rounded-xl border border-gray-600/50 hover:border-cyan-500/50 text-white transition-all duration-200"
              >
                {option}
              </motion.button>
            ))}
          </div>
        )}

        {/* Text Question */}
        {question.type === 'text' && (
          <div>
            <textarea
              placeholder="Escribe tu respuesta..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleAnswer((e.target as HTMLTextAreaElement).value)
                }
              }}
            />
            <button
              onClick={(e) => {
                const textarea = (e.target as HTMLButtonElement).previousElementSibling as HTMLTextAreaElement
                if (textarea.value) handleAnswer(textarea.value)
              }}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl"
            >
              Continuar
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
