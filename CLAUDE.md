# CLAUDE.md - NewCool Feedback

## Identidad del Modulo

```
MODULO: newcool-feedback
DEPARTAMENTO: T12-COMMUNITY
ROL: Sistema de Feedback, Encuestas y NPS
DOMINIO: feedback.newcool.io
PUERTO: 3013
```

## Descripcion

Sistema completo de recoleccion de feedback de usuarios incluyendo:
- **NPS (Net Promoter Score)**: Medir lealtad y satisfaccion
- **Encuestas**: Recolectar insights estructurados
- **User Voice**: Sugerencias, bugs, preguntas de la comunidad

## Componentes Principales

| Componente | Funcion | Archivo |
|------------|---------|---------|
| `NPSWidget` | Widget de puntuacion NPS 0-10 | `components/NPS/NPSWidget.tsx` |
| `SurveyCard` | Encuestas con multiples tipos de preguntas | `components/Survey/SurveyCard.tsx` |
| `FeedbackForm` | Formulario de feedback abierto | `components/Feedback/FeedbackForm.tsx` |

## Tipos de Preguntas Soportadas

```yaml
survey_question_types:
  - rating: Escala 1-5 estrellas
  - emoji: Escala de emojis (5 niveles)
  - multiple_choice: Opciones multiples
  - text: Respuesta abierta
  - nps: Escala 0-10 con categorias
```

## Metricas NPS

```
NPS Score = ((Promotores - Detractores) / Total) * 100

Categorias:
- Detractores: 0-6 (insatisfechos)
- Pasivos: 7-8 (satisfechos pero no entusiastas)
- Promotores: 9-10 (entusiastas leales)

Benchmark:
- < 0: Necesita mejora urgente
- 0-30: Bueno
- 30-70: Excelente
- > 70: World class
```

## Stack Tecnologico

```
Frontend: Next.js 15, React 19
Animaciones: Framer Motion
Estado: Zustand (persistente en localStorage)
Estilos: Tailwind CSS 4
Puerto: 3013
```

## Estructura de Archivos

```
newcool-feedback/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Dashboard principal
│   │   └── globals.css
│   ├── components/
│   │   ├── NPS/
│   │   │   └── NPSWidget.tsx     # Widget NPS
│   │   ├── Survey/
│   │   │   └── SurveyCard.tsx    # Encuestas
│   │   └── Feedback/
│   │       └── FeedbackForm.tsx  # Formulario feedback
│   └── lib/
│       ├── stores/
│       │   └── useFeedbackStore.ts
│       └── types/
│           └── index.ts
├── package.json
└── CLAUDE.md
```

## Comandos

```bash
# Desarrollo
npm run dev    # http://localhost:3013

# Build
npm run build

# Produccion
npm run start
```

## Integracion con T12-COMMUNITY

```yaml
recibe_de:
  - newcool-community: datos de usuarios
  - newcool-cerebro: contexto de sesion

provee_a:
  - newcool-impact: metricas de satisfaccion
  - newcool-analytics: datos de feedback
  - newcool-cerebro: NPS en tiempo real
```

## API Endpoints (Planificados)

```yaml
POST /api/feedback/nps:
  description: "Enviar puntuacion NPS"
  body: { score: number, feedback?: string, context?: string }

POST /api/feedback/survey:
  description: "Enviar respuesta de encuesta"
  body: { surveyId: string, answers: Record<string, any> }

POST /api/feedback/submit:
  description: "Enviar feedback general"
  body: { type: string, title: string, content: string }

GET /api/feedback/metrics:
  description: "Obtener metricas de feedback"
  response: { nps: NPSMetrics, feedbackCount: number }
```

## Principios de Diseno

```
1. Minimo friccion - Feedback en < 30 segundos
2. Feedback contextual - Preguntar en el momento correcto
3. Privacidad - Feedback anonimo por defecto
4. Accionable - Todo feedback debe poder procesarse
5. Transparencia - Mostrar que se hace con el feedback
```

## Tipos de Feedback

| Tipo | Emoji | Uso |
|------|-------|-----|
| Sugerencia | 💡 | Ideas de mejora |
| Bug | 🐛 | Reportar problemas |
| Felicitacion | 🎉 | Feedback positivo |
| Pregunta | ❓ | Dudas o consultas |

**Mantra: "Tu voz importa. Cada feedback nos hace mejores."**
