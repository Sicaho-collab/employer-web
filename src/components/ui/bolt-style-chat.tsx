import { useState, useRef, useEffect, useCallback } from 'react'
import { Plus, Paperclip, Image, Code } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ButtonColorful } from '@/components/ui/button-colorful'

/* ─────────────────────────────────────────────────────────────────────────────
   Attachment Menu
   ───────────────────────────────────────────────────────────────────────────── */

interface AttachmentMenuProps {
  open: boolean
  onClose: () => void
}

function AttachmentMenu({ open, onClose }: AttachmentMenuProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open, onClose])

  if (!open) return null

  const items = [
    { icon: Paperclip, label: 'Upload file' },
    { icon: Image, label: 'Add image' },
    { icon: Code, label: 'Import code' },
  ]

  return (
    <div
      ref={ref}
      className="absolute left-0 bottom-full mb-2 w-48 bg-m3-surface-container-low rounded-m3-md shadow-m3-2 border border-m3-outline-variant overflow-hidden z-50"
    >
      {items.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          onClick={onClose}
          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-m3-on-surface hover:bg-m3-surface-container-high transition-colors"
        >
          <Icon className="size-4 text-m3-on-surface-variant" />
          {label}
        </button>
      ))}
    </div>
  )
}

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
  const [attachOpen, setAttachOpen] = useState(false)
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
      <div className="flex items-center justify-between px-3 pb-3 pt-1">
        {/* Left: attachment */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setAttachOpen(o => !o)}
            className="flex items-center justify-center size-8 rounded-m3-full text-m3-on-surface-variant hover:bg-m3-surface-container-high transition-colors"
            aria-label="Add attachment"
          >
            <Plus className="size-4" />
          </button>
          <AttachmentMenu open={attachOpen} onClose={() => setAttachOpen(false)} />
        </div>

        {/* Right: char count + submit */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-m3-on-surface-variant tabular-nums">
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
