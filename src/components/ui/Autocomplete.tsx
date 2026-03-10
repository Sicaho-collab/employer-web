import { useState, useRef, useEffect, useCallback } from 'react'

export interface AutocompleteOption {
  label: string
  value: string
  disabled?: boolean
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  label?: string
  placeholder?: string
  multiple?: boolean
  value?: AutocompleteOption | AutocompleteOption[] | null
  onChange?: (value: AutocompleteOption | AutocompleteOption[] | null) => void
  disabled?: boolean
  width?: number | string
}

export default function Autocomplete({
  options,
  label = 'Option',
  placeholder,
  multiple = false,
  value,
  onChange,
  disabled = false,
  width = 300,
}: AutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedValues: AutocompleteOption[] = multiple
    ? (Array.isArray(value) ? value : [])
    : value && !Array.isArray(value) ? [value] : []

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selectedValues.some((sel) => sel.value === opt.value)
  )

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const handleSelect = (option: AutocompleteOption) => {
    if (option.disabled) return
    if (multiple) {
      const next = [...selectedValues, option]
      onChange?.(next)
    } else {
      onChange?.(option)
      setOpen(false)
    }
    setInputValue('')
    inputRef.current?.focus()
  }

  const handleRemoveChip = (option: AutocompleteOption) => {
    if (multiple) {
      const next = selectedValues.filter((v) => v.value !== option.value)
      onChange?.(next)
    }
  }

  const handleClear = () => {
    onChange?.(multiple ? [] : null)
    setInputValue('')
    setOpen(false)
  }

  const handleInputClick = () => {
    if (!disabled) setOpen(true)
  }

  const hasValue = selectedValues.length > 0
  const showLabel = hasValue || open || inputValue

  return (
    <div ref={containerRef} style={{ ...styles.root, width, opacity: disabled ? 0.5 : 1 }}>
      <div
        style={{
          ...styles.inputWrapper,
          ...(open ? styles.inputWrapperFocused : styles.inputWrapperDefault),
        }}
        onClick={handleInputClick}
      >
        {/* Floating label */}
        {showLabel && (
          <div style={styles.labelContainer}>
            <span
              style={{
                ...styles.label,
                color: open ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              }}
            >
              {label}
            </span>
          </div>
        )}

        <div style={styles.container}>
          {/* Chips for multiple mode */}
          {multiple && selectedValues.map((chip) => (
            <span key={chip.value} style={styles.chip}>
              <span style={styles.chipLabel}>{chip.label}</span>
              <button
                type="button"
                style={styles.chipClose}
                onClick={(e) => { e.stopPropagation(); handleRemoveChip(chip) }}
                aria-label={`Remove ${chip.label}`}
              >
                <CloseIcon size={14} />
              </button>
            </span>
          ))}

          {/* Input / display value */}
          {!multiple && hasValue && !open ? (
            <span style={styles.valueText}>{selectedValues[0].label}</span>
          ) : (
            <input
              ref={inputRef}
              style={styles.input}
              value={inputValue}
              onChange={(e) => { setInputValue(e.target.value); setOpen(true) }}
              onFocus={() => setOpen(true)}
              placeholder={!hasValue ? (placeholder || label) : ''}
              disabled={disabled}
              aria-expanded={open}
              aria-haspopup="listbox"
              role="combobox"
            />
          )}

          {/* Clear button */}
          {hasValue && (
            <button
              type="button"
              style={styles.clearButton}
              onClick={(e) => { e.stopPropagation(); handleClear() }}
              aria-label="Clear"
            >
              <CloseIcon size={18} />
            </button>
          )}

          {/* Arrow indicator */}
          <div style={styles.arrowButton}>
            <ArrowIcon direction={open ? 'up' : 'down'} />
          </div>
        </div>
      </div>

      {/* Dropdown menu */}
      {open && (
        <div style={styles.menu}>
          <div style={styles.menuPaper}>
            <ul style={styles.menuList} role="listbox">
              {filteredOptions.length === 0 ? (
                <li style={styles.menuItemEmpty}>No options</li>
              ) : (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    style={{
                      ...styles.menuItem,
                      ...(option.disabled ? styles.menuItemDisabled : {}),
                    }}
                    role="option"
                    aria-selected={selectedValues.some((v) => v.value === option.value)}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={(e) => {
                      if (!option.disabled)
                        (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent'
                    }}
                  >
                    {option.label}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

function CloseIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path
        d="M6 6L14 14M14 6L6 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ArrowIcon({ direction }: { direction: 'up' | 'down' }) {
  return (
    <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <path
        d={direction === 'down' ? 'M7 10L12 15L17 10' : 'M7 14L12 9L17 14'}
        stroke="var(--color-text-secondary)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--radius-md)',
    padding: '0 12px',
    cursor: 'pointer',
  },
  inputWrapperDefault: {
    border: '1px solid var(--color-border-strong)',
  },
  inputWrapperFocused: {
    border: '2px solid var(--color-primary)',
    padding: '0 11px', // compensate for 2px border
  },
  labelContainer: {
    position: 'absolute',
    top: -8,
    left: 10,
    padding: '0 4px',
    background: 'var(--color-surface)',
    lineHeight: 1,
  },
  label: {
    fontSize: 'var(--text-xs)',
    fontWeight: 400,
    letterSpacing: 0.15,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 'var(--space-2)',
    padding: '12px 0',
    minHeight: 24,
  },
  valueText: {
    flex: 1,
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-primary)',
    lineHeight: '24px',
  },
  input: {
    flex: 1,
    minWidth: 60,
    border: 'none',
    outline: 'none',
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-primary)',
    background: 'transparent',
    lineHeight: '24px',
    fontFamily: 'inherit',
    padding: 0,
  },
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 2,
    background: 'var(--color-border)',
    borderRadius: 100,
    padding: '2px 4px 2px 10px',
    maxHeight: 24,
  },
  chipLabel: {
    fontSize: 'var(--text-sm)',
    color: 'var(--color-text-primary)',
    lineHeight: '18px',
    letterSpacing: 0.16,
  },
  chipClose: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
    color: 'var(--color-text-muted)',
    borderRadius: 100,
    width: 18,
    height: 18,
  },
  clearButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: 0,
    color: 'var(--color-text-muted)',
    flexShrink: 0,
  },
  arrowButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 100,
    marginTop: 2,
  },
  menuPaper: {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    boxShadow: 'var(--shadow-md)',
    overflow: 'hidden',
  },
  menuList: {
    listStyle: 'none',
    padding: 'var(--space-2) 0',
    margin: 0,
    maxHeight: 200,
    overflowY: 'auto' as const,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px var(--space-4)',
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-primary)',
    cursor: 'pointer',
    lineHeight: 1.5,
    letterSpacing: 0.15,
  },
  menuItemDisabled: {
    color: 'var(--color-text-muted)',
    cursor: 'default',
  },
  menuItemEmpty: {
    display: 'flex',
    alignItems: 'center',
    padding: '6px var(--space-4)',
    fontSize: 'var(--text-md)',
    color: 'var(--color-text-muted)',
    fontStyle: 'italic',
  },
}
