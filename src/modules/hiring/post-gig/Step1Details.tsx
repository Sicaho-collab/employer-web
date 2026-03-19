import { useState } from 'react'
import { simulateAI, SKILL_LEVEL_LABEL } from './gigUtils'
import type { WizardState, SkillLevel } from './gigUtils'
import { Button, Card, TextField } from '@sicaho-collab/ui-web'

const SKILL_LEVELS: SkillLevel[] = [1, 2, 3]

interface Props {
  wizard: WizardState
  patch:  (partial: Partial<WizardState>) => void
  onNext: () => void
}

export default function Step1Details({ wizard, patch, onNext }: Props) {

  const [, setAiLoading] = useState(false)
  const [newSkillName, setNewSkillName] = useState('')
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)

  const canNext = wizard.aiTitle.trim().length > 0
               && wizard.aiDescription.trim().length > 0

  // ── AI regenerate ──
  async function handleRegenerate() {
    setAiLoading(true)
    try {
      const ai = await simulateAI(wizard.rawDescription)
      patch({
        aiTitle:       ai.aiTitle,
        aiDescription: ai.aiDescription,
        skills:        ai.skills,
        workCategory:  ai.workCategory,
      })
    } finally {
      setAiLoading(false)
    }
  }

  function handleRestoreDraft() {
    patch({ aiDescription: wizard.rawDescription })
  }

  function handleRevertToOriginal() {
    // Revert to the AI-generated version by re-running AI
    handleRegenerate()
  }

  // ── Skill helpers ──
  function updateSkillLevel(index: number, level: SkillLevel) {
    const updated = wizard.skills.map((sk, i) => i === index ? { ...sk, level } : sk)
    patch({ skills: updated })
  }

  function removeSkill(index: number) {
    patch({ skills: wizard.skills.filter((_, i) => i !== index) })
  }

  function addSkill() {
    const name = newSkillName.trim()
    if (!name || wizard.skills.length >= 6) return
    if (wizard.skills.some(sk => sk.skill.toLowerCase() === name.toLowerCase())) return
    patch({ skills: [...wizard.skills, { skill: name, level: 2 as SkillLevel }] })
    setNewSkillName('')
  }

  function reorderSkills(fromIdx: number, toIdx: number) {
    if (fromIdx === toIdx) return
    const arr = [...wizard.skills]
    const [moved] = arr.splice(fromIdx, 1)
    arr.splice(toIdx, 0, moved)
    patch({ skills: arr })
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Title ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <p className="text-sm font-semibold text-m3-on-surface">Title</p>
        <TextField
          variant="outlined"
          label="Role Title"
          required
          value={wizard.aiTitle}
          maxLength={80}
          onChange={e => patch({ aiTitle: e.target.value })}
        />
      </Card>

      {/* ── Description ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <p className="text-sm font-semibold text-m3-on-surface">Description</p>
          <div className="flex items-center gap-3">
            <button
              className="text-xs text-m3-on-surface-variant flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-m3-primary"
              onClick={handleRestoreDraft}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7C2 4.24 4.24 2 7 2C9.76 2 12 4.24 12 7C12 9.76 9.76 12 7 12C5.4 12 3.98 11.22 3.08 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 4V7H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Restore my draft
            </button>
            <button
              className="text-xs text-m3-on-surface-variant flex items-center gap-1 bg-transparent border-none cursor-pointer hover:text-m3-primary"
              onClick={handleRevertToOriginal}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M12 7C12 4.24 9.76 2 7 2C4.24 2 2 4.24 2 7C2 9.76 4.24 12 7 12C8.6 12 10.02 11.22 10.92 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 4V7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Revert to Original
            </button>
          </div>
        </div>
        <TextField
          variant="outlined"
          label="Description"
          multiline
          rows={8}
          required
          value={wizard.aiDescription}
          maxLength={2000}
          onChange={e => patch({ aiDescription: e.target.value })}
        />
      </Card>

      {/* ── Skills ── */}
      <Card variant="outlined" className="p-5 flex flex-col gap-3 bg-m3-surface-container-lowest">
        <div className="flex justify-between items-baseline flex-wrap gap-2">
          <p className="text-sm font-semibold text-m3-on-surface">
            Skills Required
            <span className="font-normal text-m3-on-surface-variant text-xs"> — up to 6</span>
          </p>
          <span className="text-xs text-m3-on-surface-variant">Drag to set priority</span>
        </div>

        <div className="flex flex-col gap-2">
          {wizard.skills.map((skill, i) => {
            const isDragging   = dragIndex === i
            const isDropTarget = hoverIndex === i && dragIndex !== null && dragIndex !== i
            return (
              <div
                key={`${skill.skill}-${i}`}
                draggable
                className="flex items-center gap-3 border border-m3-outline-variant rounded-m3-sm px-3 py-2 flex-wrap bg-white"
                style={{
                  opacity:     isDragging   ? 0.35 : 1,
                  borderColor: isDropTarget ? 'var(--color-m3-primary)' : undefined,
                  background:  isDropTarget ? '#F3EEFA' : undefined,
                  transition:  'border-color 0.1s, background 0.1s',
                  userSelect:  'none',
                  cursor:      'default',
                }}
                onDragStart={() => setDragIndex(i)}
                onDragOver={e => { e.preventDefault(); setHoverIndex(i) }}
                onDrop={() => {
                  if (dragIndex !== null) reorderSkills(dragIndex, i)
                  setDragIndex(null); setHoverIndex(null)
                }}
                onDragEnd={() => { setDragIndex(null); setHoverIndex(null) }}
              >
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="w-[18px] h-[18px] rounded-full bg-m3-surface-container-highest text-m3-on-surface-variant text-[10px] font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-m3-on-surface-variant text-base cursor-grab leading-none" style={{ letterSpacing: '-1px' }} title="Drag to reorder">
                    ⠿
                  </span>
                </div>
                <span className="text-sm font-medium text-m3-on-surface flex-1 min-w-0" style={{ flex: '1 1 80px' }}>
                  {skill.skill}
                </span>
                <div className="flex border border-m3-outline-variant rounded-m3-xs overflow-hidden flex-shrink-0">
                  {SKILL_LEVELS.map(lvl => (
                    <button
                      key={lvl}
                      className={
                        skill.level === lvl
                          ? 'px-2.5 py-0.5 text-xs font-semibold bg-m3-primary text-white border-none cursor-pointer whitespace-nowrap'
                          : 'px-2.5 py-0.5 text-xs font-medium text-m3-on-surface-variant bg-m3-surface border-none cursor-pointer whitespace-nowrap hover:bg-m3-surface-container'
                      }
                      onClick={() => updateSkillLevel(i, lvl)}
                    >
                      {SKILL_LEVEL_LABEL[lvl]}
                    </button>
                  ))}
                </div>
                <button
                  className="bg-transparent border-none text-xs text-m3-on-surface-variant cursor-pointer p-0.5 flex-shrink-0 leading-none hover:text-m3-error"
                  onClick={() => removeSkill(i)}
                >
                  ✕
                </button>
              </div>
            )
          })}
        </div>

        {wizard.skills.length < 6 && (
          <div className="flex gap-2 items-center">
            <input
              className="flex-1 h-10 px-3 border border-m3-outline rounded-m3-xs text-sm text-m3-on-surface bg-transparent outline-none focus:border-2 focus:border-m3-primary"
              placeholder="Add a skill"
              value={newSkillName}
              maxLength={40}
              onChange={e => setNewSkillName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
            />
            <Button variant="tonal" size="sm" onClick={addSkill}>Add</Button>
          </div>
        )}

        <p className="text-xs text-m3-on-surface-variant leading-relaxed">
          Top skills carry more weight in student matching.
        </p>
      </Card>

      {/* ── Footer ── */}
      <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
        <Button disabled={!canNext} onClick={onNext}>
          Continue →
        </Button>
      </div>
    </div>
  )
}
