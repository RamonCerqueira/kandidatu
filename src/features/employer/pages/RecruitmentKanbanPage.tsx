import { useState } from 'react'
import { recruitmentStages, type RecruitmentStage } from '../../../schemas/employer'
import { useApplicantActions, useApplicants } from '../hooks'
import { STAGE_LABELS } from './EmployerCandidatesPage'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'

export default function RecruitmentKanbanPage() {
  const { data, isLoading, isError } = useApplicants({})
  const { setStage } = useApplicantActions()
  const [draggingId, setDraggingId] = useState<string | null>(null)

  const onDrop = (stage: RecruitmentStage) => {
    if (draggingId) setStage.mutate({ id: draggingId, stage })
    setDraggingId(null)
  }

  return (
    <div>
      <Seo title="Processo Seletivo (Kanban)" />
      <PageHeader title="Processo seletivo" subtitle="Arraste e solte candidatos entre as etapas do recrutamento." />

      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Sem candidatos em processo seletivo">
        {data && (
          <div className="grid gap-4 overflow-x-auto md:grid-cols-3 xl:grid-cols-6">
            {recruitmentStages.map((stage) => {
              const items = data.filter((a) => a.stage === stage)
              return (
                <section
                  key={stage}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(stage)}
                  className="card flex min-h-[380px] min-w-[220px] flex-col p-3"
                >
                  <header className="mb-3 flex items-center justify-between">
                    <h2 className="text-xs font-bold uppercase text-ink-muted">{STAGE_LABELS[stage]}</h2>
                    <span className="rounded-full bg-canvas px-2 py-0.5 text-xs font-semibold">{items.length}</span>
                  </header>
                  <div className="space-y-2">
                    {items.map((a) => (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={() => setDraggingId(a.id)}
                        className="cursor-grab rounded-lg border border-line bg-canvas p-3 text-xs transition active:cursor-grabbing"
                      >
                        <p className="font-semibold">{a.fullName}</p>
                        <p className="text-ink-muted">{a.jobTitle}</p>
                        <p className="mt-1 text-[11px] text-ink-muted">{a.location} · {a.experience}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </QueryState>
    </div>
  )
}

