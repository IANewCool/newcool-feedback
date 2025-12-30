'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface FeedbackFormProps {
  onSubmit: (feedback: { type: string; title: string; content: string; tags?: string[] }) => void
}

const feedbackTypes = [
  { id: 'suggestion', label: 'Sugerencia', emoji: '💡', color: 'from-yellow-500 to-orange-500' },
  { id: 'bug', label: 'Problema', emoji: '🐛', color: 'from-red-500 to-pink-500' },
  { id: 'praise', label: 'Felicitación', emoji: '🎉', color: 'from-green-500 to-emerald-500' },
  { id: 'question', label: 'Pregunta', emoji: '❓', color: 'from-blue-500 to-cyan-500' },
]

export function FeedbackForm({ onSubmit }: FeedbackFormProps) {
  const [type, setType] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (type && title && content) {
      onSubmit({ type, title, content })
      setSubmitted(true)
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-8 text-center border border-cyan-500/30"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-6xl mb-4"
        >
          📬
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">¡Feedback enviado!</h3>
        <p className="text-gray-400">Tu voz importa. Revisaremos tu feedback pronto.</p>
        <button
          onClick={() => {
            setSubmitted(false)
            setType(null)
            setTitle('')
            setContent('')
          }}
          className="mt-6 px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-white transition-colors"
        >
          Enviar otro feedback
        </button>
      </motion.div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-2xl p-8 backdrop-blur-xl border border-gray-700/50">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-4xl mb-4"
        >
          📝
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">Comparte tu feedback</h3>
        <p className="text-sm text-gray-400">Tu opinión nos ayuda a construir una mejor comunidad</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Type Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Tipo de feedback
          </label>
          <div className="grid grid-cols-2 gap-3">
            {feedbackTypes.map((ft) => (
              <motion.button
                key={ft.id}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setType(ft.id)}
                className={`p-4 rounded-xl border transition-all duration-200 ${
                  type === ft.id
                    ? `bg-gradient-to-r ${ft.color} border-transparent text-white`
                    : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:border-gray-500/50'
                }`}
              >
                <span className="text-2xl mb-2 block">{ft.emoji}</span>
                <span className="font-medium">{ft.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resume tu feedback en pocas palabras..."
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
            required
          />
        </div>

        {/* Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Descripción
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Cuéntanos más detalles..."
            rows={4}
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            required
          />
        </div>

        {/* Submit */}
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={!type || !title || !content}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar Feedback
        </motion.button>
      </form>
    </div>
  )
}
