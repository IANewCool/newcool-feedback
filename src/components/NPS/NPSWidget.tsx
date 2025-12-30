'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface NPSWidgetProps {
  onSubmit: (score: number, feedback?: string) => void
  question?: string
  showFeedback?: boolean
}

export function NPSWidget({
  onSubmit,
  question = "¿Qué tan probable es que recomiendes NewCool a un amigo o colega?",
  showFeedback = true
}: NPSWidgetProps) {
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const getScoreColor = (score: number) => {
    if (score <= 6) return 'from-red-500 to-orange-500' // Detractor
    if (score <= 8) return 'from-yellow-500 to-amber-500' // Passive
    return 'from-green-500 to-emerald-500' // Promoter
  }

  const getScoreLabel = (score: number) => {
    if (score <= 6) return { label: 'Detractor', emoji: '😞' }
    if (score <= 8) return { label: 'Pasivo', emoji: '😐' }
    return { label: 'Promotor', emoji: '😊' }
  }

  const handleSubmit = () => {
    if (selectedScore !== null) {
      onSubmit(selectedScore, feedback || undefined)
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-8 text-center border border-green-500/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          🙏
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Gracias por tu feedback!</h3>
        <p className="text-gray-400">Tu opinión nos ayuda a mejorar cada día.</p>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-4"
        >
          📊
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">{question}</h3>
        <p className="text-sm text-gray-400">0 = Nada probable · 10 = Muy probable</p>
      </div>

      {/* Score Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {[...Array(11)].map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedScore(i)}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
              selectedScore === i
                ? `bg-gradient-to-r ${getScoreColor(i)} text-white shadow-lg`
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
            }`}
          >
            {i}
          </motion.button>
        ))}
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-gray-500 mb-6 px-2">
        <span>Nada probable</span>
        <span>Muy probable</span>
      </div>

      {/* Selected Score Info */}
      <AnimatePresence>
        {selectedScore !== null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <div className={`text-center p-4 rounded-xl bg-gradient-to-r ${getScoreColor(selectedScore)}/20 border border-${getScoreColor(selectedScore).split('-')[1]}-500/30`}>
              <span className="text-2xl mr-2">{getScoreLabel(selectedScore).emoji}</span>
              <span className="font-bold text-white">{getScoreLabel(selectedScore).label}</span>
              <span className="text-gray-400 ml-2">· Puntuación: {selectedScore}/10</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Feedback Textarea */}
      {showFeedback && selectedScore !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {selectedScore <= 6
              ? "¿Qué podríamos mejorar?"
              : selectedScore <= 8
                ? "¿Qué te haría darnos un 10?"
                : "¿Qué es lo que más te gusta?"}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tu feedback es valioso para nosotros..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
          />
        </motion.div>
      )}

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={selectedScore === null}
        className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Enviar Feedback
      </motion.button>
    </div>
  )
}
