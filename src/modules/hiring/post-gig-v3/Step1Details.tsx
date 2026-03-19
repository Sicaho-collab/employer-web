import { useState } from 'react'
import { Button, Card, Chip, ChipGroup, TextField, Icon, Autocomplete } from '@sicaho-collab/ui-web'
import type { AutocompleteOption } from '@sicaho-collab/ui-web'
import type { GigV3Data } from './PostGigV3Page'
import { TOOLS_OPTIONS } from './gigV3Utils'

const CAPABILITY_OPTIONS = [
  'Analytical & Data Thinking',
  'Communication & Influence',
  'Digital & Technical Fluency',
  'Project & Execution',
  'Collaboration',
  'Creative Thinking',
  'Business Insight',
  'Adaptability',
] as const

const MAX_CAPABILITIES = 3

interface Props {
  data: GigV3Data
  patch: (updates: Partial<GigV3Data>) => void
  onNext: () => void
}

export default function Step1Details({ data, patch, onNext }: Props) {
  const [titleTouched, setTitleTouched] = useState(false)
  const [descTouched, setDescTouched] = useState(false)
  const [capTouched, setCapTouched] = useState(false)
  const [copied, setCopied] = useState(false)

  function handleCopyPrompt() {
    navigator.clipboard.writeText(data.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const titleLen = data.title.length
  const descLen = data.description.length

  const titleError =
    titleTouched && titleLen < 5
      ? 'Title must be at least 5 characters'
      : undefined

  const descError =
    descTouched && descLen < 20
      ? 'Description must be at least 20 characters'
      : undefined

  const capError =
    capTouched && data.capabilities.length === 0
      ? 'Select at least one capability'
      : undefined

  const canContinue =
    titleLen >= 5 &&
    titleLen <= 100 &&
    descLen >= 20 &&
    descLen <= 1000 &&
    data.capabilities.length > 0

  function toggleCapability(cap: string) {
    setCapTouched(true)
    const current = data.capabilities
    if (current.includes(cap)) {
      patch({ capabilities: current.filter(c => c !== cap) })
    } else if (current.length < MAX_CAPABILITIES) {
      patch({ capabilities: [...current, cap] })
    }
  }

  const showTitleRevert = !!data.aiTitle && data.title !== data.aiTitle
  const showDescRevert = !!data.aiDescription && data.description !== data.aiDescription

  function handleContinue() {
    setTitleTouched(true)
    setDescTouched(true)
    setCapTouched(true)
    if (canContinue) onNext()
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest"
        >
          {/* Original prompt reference — inside card */}
          {data.prompt && (
            <div className="rounded-m3-sm bg-m3-surface-container px-4 py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium text-m3-on-surface-variant mb-1">What you told us</p>
                <p className="text-sm text-m3-on-surface-variant italic">"{data.prompt}"</p>
              </div>
              <button
                type="button"
                onClick={handleCopyPrompt}
                className="shrink-0 p-1.5 rounded-m3-sm text-m3-on-surface-variant hover:bg-m3-surface-container-high transition-colors flex items-center justify-center"
                aria-label="Copy prompt to clipboard"
              >
                {copied ? <Icon name="check" size={16} className="text-m3-primary" /> : <Icon name="content_copy" size={16} />}
              </button>
            </div>
          )}

          <p className="text-sm font-semibold text-m3-on-surface">
            Gig Information
          </p>
          <div>
            <TextField
              variant="outlined"
              label="Gig Title"
              placeholder="Campus Event Setup Assistant"
              required
              value={data.title}
              maxLength={100}
              onChange={e => patch({ title: e.target.value.slice(0, 100) })}
              onBlur={() => setTitleTouched(true)}
              error={!!titleError}
              errorText={titleError}
            />
            <div className="flex items-center justify-between mt-1 px-4">
              <p
                className={`text-xs ${
                  titleLen >= 100
                    ? 'text-m3-error'
                    : 'text-m3-on-surface-variant'
                }`}
              >
                {titleLen} / 100
              </p>
              {showTitleRevert && (
                <button
                  type="button"
                  onClick={() => patch({ title: data.aiTitle })}
                  className="text-xs text-m3-primary hover:underline"
                >
                  Revert to AI suggestion
                </button>
              )}
            </div>
          </div>
          <div>
            <TextField
              variant="outlined"
              label="Description"
              placeholder="Describe what the student will be doing..."
              multiline
              rows={4}
              required
              value={data.description}
              maxLength={1000}
              onChange={e =>
                patch({ description: e.target.value.slice(0, 1000) })
              }
              onBlur={() => setDescTouched(true)}
              error={!!descError}
              errorText={descError}
            />
            <div className="flex items-center justify-between mt-1 px-4">
              <p
                className={`text-xs ${
                  descLen >= 1000
                    ? 'text-m3-error'
                    : 'text-m3-on-surface-variant'
                }`}
              >
                {descLen} / 1000
              </p>
              {showDescRevert && (
                <button
                  type="button"
                  onClick={() => patch({ description: data.aiDescription })}
                  className="text-xs text-m3-primary hover:underline"
                >
                  Revert to AI suggestion
                </button>
              )}
            </div>
          </div>
        </Card>

        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest"
        >
          <ChipGroup
            label="Capabilities"
            supportingText={`Select up to ${MAX_CAPABILITIES} capabilities required for this gig`}
            required
            error={!!capError}
            errorText={capError}
          >
            {CAPABILITY_OPTIONS.map(cap => {
              const selected = data.capabilities.includes(cap)
              const disabled = !selected && data.capabilities.length >= MAX_CAPABILITIES
              return (
                <Chip
                  key={cap}
                  variant="filter"
                  selected={selected}
                  onClick={() => !disabled && toggleCapability(cap)}
                  className={disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                >
                  {cap}
                </Chip>
              )
            })}
          </ChipGroup>
        </Card>

        {/* Tools section */}
        <Card
          variant="outlined"
          className="p-4 md:p-5 flex flex-col gap-4 bg-m3-surface-container-lowest"
        >
          <div>
            <p className="text-sm font-semibold text-m3-on-surface">
              Tools
            </p>
            <p className="text-xs text-m3-on-surface-variant mt-1">
              What tools help execute those tasks? (optional)
            </p>
          </div>

          <Autocomplete
            options={TOOLS_OPTIONS.map(t => ({ label: t, value: t }))}
            label="Tools"
            placeholder="Search tools..."
            multiple
            value={data.tools.map(t => ({ label: t, value: t }))}
            onChange={(val) => patch({ tools: (val as AutocompleteOption[]).map(v => v.value) })}
          />
        </Card>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant mt-6">
        <Button disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </>
  )
}
