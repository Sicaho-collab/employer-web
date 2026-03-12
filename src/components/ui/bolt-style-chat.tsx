import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { ButtonColorful } from '@sicaho-collab/ui-web'

/* ─────────────────────────────────────────────────────────────────────────────
   ChatInput — the main exported component
   ───────────────────────────────────────────────────────────────────────────── */

export interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  placeholder?: string
  submitLabel?: string
  maxLength?: number
  minLength?: number
  className?: string
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = 'Describe what you need help with...',
  submitLabel = 'Get Started',
  maxLength = 500,
  minLength = 10,
  className,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [focused, setFocused] = useState(false)

  const canSubmit = value.trim().length >= minLength

  // Auto-resize textarea
  const resize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [])

  useEffect(() => {
    resize()
  }, [value, resize])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (canSubmit) onSubmit(value.trim())
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value
    if (v.length <= maxLength) onChange(v)
  }

  return (
    <div
      className={cn(
        'relative rounded-m3-lg border transition-all duration-200',
        focused
          ? 'border-m3-primary shadow-m3-2'
          : 'border-m3-outline-variant shadow-m3-1',
        'bg-m3-surface-container-lowest',
        className,
      )}
    >
      {/* Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={1}
        className="w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm text-m3-on-surface placeholder:text-m3-on-surface-variant outline-none leading-relaxed"
        style={{ minHeight: '56px', maxHeight: '200px' }}
      />

      {/* Bottom toolbar */}
      <div className="flex items-center justify-end px-3 pb-3 pt-1">
        <div className="flex items-center gap-3">
          <span className={cn(
            'text-xs tabular-nums',
            value.length > maxLength ? 'text-m3-error' : 'text-m3-on-surface-variant',
          )}>
            {value.length}/{maxLength}
          </span>
          <ButtonColorful
            label={submitLabel}
            disabled={!canSubmit}
            onClick={() => onSubmit(value.trim())}
          />
        </div>
      </div>
    </div>
  )
}
