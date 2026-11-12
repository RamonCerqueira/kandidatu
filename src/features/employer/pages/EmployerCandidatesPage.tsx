import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarPlus, Download, FileText, Star } from 'lucide-react'
import { recruitmentStages, type Applicant, type RecruitmentStage } from '../../../schemas/employer'
import { EDUCATION_LEVELS, EXPERIENCE_LEVELS } from '../../../constants'
import { useApplicantActions, useApplicants, useEmployerJobs } from '../hooks'
import { PageHeader, QueryState } from '../../../components/shared/Dashboard'
import { Seo } from '../../../components/shared/Seo'
import { formatDate } from '../../../utils/format'

export const STAGE_LABELS: Record<RecruitmentStage, string> = {
  NEW: 'Novos candidatos',
  REVIEWING: 'Em análise',
  SHORTLISTED: 'Pré-selecionados',
  INTERVIEW: 'Entrevista',
  APPROVED: 'Aprovados',
  REJECTED: 'Reprovados',
}

export default function EmployerCandidatesPage() {
  const [view, setView] = useState<'cards' | 'table'>('cards')
  const [jobId, setJobId] = useState('')
  const [experience, setExperience] = useState('')
  const [education, setEducation] = useState('')
  const [skill, setSkill] = useState('')
  const [location, setLocation] = useState('')
  const [stage, setStage] = useState<RecruitmentStage | ''>('')
  const [selectedNote, setSelectedNote] = useState<Applicant | null>(null)
  const [noteText, setNoteText] = useState('')

  const jobs = useEmployerJobs()
  const { data, isLoading, isError } = useApplicants({
    jobId: jobId || undefined,
    experience: experience || undefined,
    education: education || undefined,
    skill: skill || undefined,
    location: location || undefined,
    stage: stage || undefined,
  })
  const { setStage: changeStage, saveNote, toggleFav } = useApplicantActions()

  return (
    <div>
      <Seo title="Gestão de Candidatos" />
      <PageHeader
        title="Gestão de candidatos"
        subtitle="Filtre, avalie currículos, altere estados e agende entrevistas."
        actions={
          <div className="inline-flex rounded-lg border border-line bg-white p-1 text-xs font-medium">
            <button type="button" onClick={() => setView('cards')} className={`rounded-md px-3 py-1.5 ${view === 'cards' ? 'bg-brand text-white' : ''}`}>Cards</button>
            <button type="button" onClick={() => setView('table')} className={`rounded-md px-3 py-1.5 ${view === 'table' ? 'bg-brand text-white' : ''}`}>Tabela</button>
          </div>
        }
      />

      <div className="card mb-6 grid gap-3 p-4 sm:grid-cols-3 lg:grid-cols-6">
        <select aria-label="Filtrar por vaga" className="input" value={jobId} onChange={(e) => setJobId(e.target.value)}>
          <option value="">Todas as vagas</option>
          {jobs.data?.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select aria-label="Experiência" className="input" value={experience} onChange={(e) => setExperience(e.target.value)}>
          <option value="">Experiência</option>
          {EXPERIENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <select aria-label="Escolaridade" className="input" value={education} onChange={(e) => setEducation(e.target.value)}>
          <option value="">Escolaridade</option>
          {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}
        </select>
        <input placeholder="Competência" className="input" value={skill} onChange={(e) => setSkill(e.target.value)} />
        <input placeholder="Localização" className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
        <select aria-label="Estado da candidatura" className="input" value={stage} onChange={(e) => setStage(e.target.value as RecruitmentStage | '')}>
          <option value="">Todos os estados</option>
          {recruitmentStages.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
      </div>

      <QueryState isLoading={isLoading} isError={isError} empty={!data?.length} emptyTitle="Nenhum candidato encontrado para estes filtros">
        {data && view === 'cards' && (
          <div className="grid gap-4 md:grid-cols-2">
            {data.map((a) => (
              <article key={a.id} className="card space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-brand-50 font-bold text-brand">
                      {a.photoUrl ? <img src={a.photoUrl} alt="" className="h-full w-full object-cover" /> : a.fullName[0]}
                    </div>
                    <div>
                      <h2 className="font-semibold">{a.fullName}</h2>
                      <p className="text-xs text-ink-muted">{a.desiredRole} · {a.location}</p>
                    </div>
                  </div>
                  <button type="button" aria-label="Favoritar candidato" onClick={() => toggleFav.mutate({ id: a.id, favorite: !a.favorite })} className="text-gold">
                    <Star className={`h-4 w-4 ${a.favorite ? 'fill-gold' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-ink-muted">Vaga: <span className="font-medium text-ink">{a.jobTitle}</span> · {a.experience} · {a.education} · {formatDate(a.appliedAt)}</p>
                <div className="flex flex-wrap gap-1">
                  {a.skills.map((s) => <span key={s} className="rounded bg-canvas px-2 py-0.5 text-[11px]">{s}</span>)}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <select aria-label="Alterar status" className="input w-auto py-1 text-xs" value={a.stage} onChange={(e) => changeStage.mutate({ id: a.id, stage: e.target.value as RecruitmentStage })}>
                    {recruitmentStages.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                  {a.curriculumUrl && (
                    <>
                      <a href={a.curriculumUrl} target="_blank" rel="noopener noreferrer" className="btn-outline px-2.5 py-1 text-xs"><FileText className="h-3.5 w-3.5" />Ver CV</a>
                      <a href={a.curriculumUrl} download className="btn-outline px-2.5 py-1 text-xs"><Download className="h-3.5 w-3.5" />Baixar</a>
                    </>
                  )}
                  <button type="button" className="btn-outline px-2.5 py-1 text-xs" onClick={() => { setSelectedNote(a); setNoteText(a.notes ?? '') }}>Observações</button>
                  <Link to={`/empresa/entrevistas?applicantId=${a.id}`} className="btn-accent px-2.5 py-1 text-xs"><CalendarPlus className="h-3.5 w-3.5" />Entrevista</Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {data && view === 'table' && (
          <div className="card overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-line bg-canvas text-ink-muted">
                <tr>
                  <th className="p-3">Candidato</th>
                  <th className="p-3">Vaga</th>
                  <th className="p-3">Local</th>
                  <th className="p-3">Exp. / Formação</th>
                  <th className="p-3">Data</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.map((a) => (
                  <tr key={a.id}>
                    <td className="p-3 font-medium">{a.fullName}</td>
                    <td className="p-3">{a.jobTitle}</td>
                    <td className="p-3">{a.location}</td>
                    <td className="p-3">{a.experience} · {a.education}</td>
                    <td className="p-3">{formatDate(a.appliedAt)}</td>
                    <td className="p-3">
                      <select aria-label="Status" className="input py-1 text-xs" value={a.stage} onChange={(e) => changeStage.mutate({ id: a.id, stage: e.target.value as RecruitmentStage })}>
                        {recruitmentStages.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </QueryState>

      {selectedNote && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md space-y-3 p-5">
            <h2 className="font-bold">Observações internas — {selectedNote.fullName}</h2>
            <textarea rows={4} className="input" value={noteText} onChange={(e) => setNoteText(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setSelectedNote(null)}>Fechar</button>
              <button type="button" className="btn-primary" onClick={() => { saveNote.mutate({ id: selectedNote.id, notes: noteText }); setSelectedNote(null) }}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

