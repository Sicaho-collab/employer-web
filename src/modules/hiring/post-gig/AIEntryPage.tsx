import { useState } from 'react'

interface Props {
  onSubmit: (description: string) => void
}

export default function AIEntryPage({ onSubmit }: Props) {
  const [text, setText] = useState('')
  const canSubmit = text.trim().length >= 20

  function handleSubmit() {
    if (!canSubmit) return
    onSubmit(text.trim())
  }

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-12">

      {/* ── Heading ── */}
      <h1
        className="text-4xl md:text-5xl font-bold text-center mb-8 leading-tight"
        style={{
          background: 'linear-gradient(135deg, #9A76BE 0%, #C76B98 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        What do you need help with?
      </h1>

      {/* ── Textarea with gradient border ── */}
      <div
        className="w-full max-w-[700px] rounded-2xl p-[2px] relative"
        style={{
          background: 'linear-gradient(135deg, #9A76BE, #C76B98)',
        }}
      >
        <div className="bg-white rounded-[14px] flex items-start relative">
          <textarea
            className="flex-1 resize-none bg-transparent text-m3-on-surface text-base leading-relaxed p-5 pr-16 outline-none rounded-[14px] min-h-[120px] placeholder:text-m3-on-surface-variant/60"
            placeholder="Describe the work you need done, and I will help you create the perfect gig to find the right talent"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && canSubmit) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />

          {/* Arrow submit button */}
          <button
            className="absolute right-4 bottom-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #9A76BE, #C76B98)'
                : '#E0E0E0',
              cursor: canSubmit ? 'pointer' : 'default',
            }}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9H14M14 9L10 5M14 9L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <p className="text-xs text-m3-on-surface-variant mt-4 text-center">
        Alumable AI can make mistakes. Please check for accuracy.{' '}
        <a href="#" className="text-m3-primary hover:underline">See terms</a>
        {' · '}
        <a href="#" className="text-m3-primary hover:underline">Give feedback</a>
      </p>
    </div>
  )
}
