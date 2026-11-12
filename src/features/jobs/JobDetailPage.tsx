import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Bookmark, Flag, Share2 } from 'lucide-react'
import { api } from '../../services/api/client'
import { useAuth } from '../auth/AuthContext'
import { useApply, useToggleSaved } from '../candidate/hooks'
import { useJob, useJobs } from './hooks'
import { JobCard } from '../../components/jobs/JobCard'
import { EmptyState, Skeleton } from '../../components/ui/feedback'
import { formatDate, formatSalary } from '../../utils/format'
import { shareLink } from '../../utils/share'
import { CONTRACT_LABELS, MODE_LABELS, REGION_LABELS } from '../../constants'
import { Seo } from '../../components/shared/Seo'

const List = ({ title, items }: { title: string; items: string[] }) =>
  items.length ? (
    <section className="mt-6">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <ul className="list-disc space-y-1 pl-5 text-sm">{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </section>
  ) : null

export default function JobDetailPage() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { user } = useAuth()
  const { data: job, isLoading, isError } = useJob(id)
  const similar = useJobs({ category: job?.category })
  const apply = useApply()
  const toggleSave = useToggleSaved()
  const [msg, setMsg] = useState('')
  const [reporting, setReporting] = useState(false)
  const [reason, setReason] = useState('')
  const salary = job ? formatSalary(job.salaryMin, job.salaryMax) : null

  const share = async () => {
    if (!job) return
    const r = await shareLink(job.title, window.location.href)
    setMsg(r === 'copied' ? 'Ligação copiada.' : r === 'failed' ? 'Não foi possível partilhar.' : '')
  }

  const onApply = async () => {
    if (!user) return nav('/entrar')
    try {
      await apply.mutateAsync(id)
      setMsg('Candidatura enviada com sucesso!')
    } catch {
      setMsg('Não foi possível enviar a candidatura.')
    }
  }

  const onSave = async () => {
    if (!user) return nav('/entrar')
    try {
      await toggleSave.mutateAsync({ jobId: id, saved: false })
      setMsg('Vaga guardada nos seus favoritos.')
    } catch {
      setMsg('Não foi possível guardar a vaga.')
    }
  }

  const sendReport = async () => {
    if (!reason.trim()) return
    try {
      await api.post('/reports', { targetType: 'JOB', targetId: id, reason: reason.trim() })
      setReporting(false)
      setReason('')
      setMsg('Denúncia enviada para análise.')
    } catch {
      setMsg('Não foi possível enviar a denúncia.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link to="/vagas" className="text-sm text-ink-muted hover:text-ink">← Voltar às vagas</Link>
      <div className="mt-4">
        {isLoading && <Skeleton className="h-64" />}
        {isError && <EmptyState title="Vaga não encontrada" description="Pode ter sido encerrada ou o servidor está indisponível." />}
        {job && (
          <>
            <Seo title={`${job.title} — ${job.company.name}`} description={job.description.slice(0, 150)} />
            <article className="card p-6">
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <p className="text-ink-muted">
                <Link to={`/empresas/${job.company.id}`} className="hover:underline">{job.company.name}</Link> · {job.city ?? REGION_LABELS[job.region]} · {CONTRACT_LABELS[job.contractType]} · {MODE_LABELS[job.workMode]}
              </p>
              {salary && <p className="mt-2 font-medium">{salary}</p>}
              <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
                {job.education && <div><dt className="text-ink-muted">Escolaridade</dt><dd>{job.education}</dd></div>}
                {job.experience && <div><dt className="text-ink-muted">Experiência</dt><dd>{job.experience}</dd></div>}
                {job.deadline && <div><dt className="text-ink-muted">Candidaturas até</dt><dd>{formatDate(job.deadline)}</dd></div>}
              </dl>
              <p className="mt-6 whitespace-pre-line text-sm">{job.description}</p>
              <List title="Responsabilidades" items={job.responsibilities} />
              <List title="Requisitos" items={job.requirements} />
              <List title="Benefícios" items={job.benefits} />
              <div className="mt-8 flex flex-wrap gap-2">
                <button type="button" className="btn-accent" onClick={onApply} disabled={apply.isPending}>Candidatar-se</button>
                <button type="button" className="btn-outline" onClick={onSave} disabled={toggleSave.isPending}><Bookmark className="h-4 w-4" aria-hidden />Salvar</button>
                <button type="button" className="btn-outline" onClick={share}><Share2 className="h-4 w-4" aria-hidden />Partilhar</button>
                <button type="button" className="btn-outline" onClick={() => (user ? setReporting(true) : nav('/entrar'))}><Flag className="h-4 w-4" aria-hidden />Denunciar</button>
              </div>
              {msg && <p role="status" className="mt-2 text-sm text-accent-600">{msg}</p>}
            </article>
            <h2 className="mb-3 mt-8 text-lg font-bold">Vagas semelhantes</h2>
            <div className="space-y-4">
              {similar.data?.items.filter((j) => j.id !== job.id).slice(0, 3).map((j) => <JobCard key={j.id} job={j} />)}
              {similar.data && similar.data.items.filter((j) => j.id !== job.id).length === 0 && <EmptyState title="Sem vagas semelhantes" />}
            </div>
          </>
        )}
      </div>

      {reporting && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="card w-full max-w-md space-y-3 p-5">
            <h2 className="font-bold">Denunciar vaga</h2>
            <textarea rows={3} placeholder="Descreva o motivo da denúncia" className="input" value={reason} onChange={(e) => setReason(e.target.value)} />
            <div className="flex justify-end gap-2">
              <button type="button" className="btn-outline" onClick={() => setReporting(false)}>Cancelar</button>
              <button type="button" className="btn-primary" onClick={sendReport}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
