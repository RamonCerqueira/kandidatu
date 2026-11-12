import { ExternalLink, Megaphone, MapPin, MessageCircle } from 'lucide-react'
import { useSponsoredAds } from '../../features/training/hooks'
import { trainingService } from '../../services/training/trainingService'
import { REGION_LABELS } from '../../constants'
import { formatXOF } from '../../utils/format'
import { BissauStripe, MotionCard } from '../ui/MotionPrimitives'
import type { SponsoredCourseAd } from '../../schemas/training'

/** Widget reutilizável para exibir propagandas/cursos patrocinados na busca de vagas e no painel do candidato */
export function SponsoredBannerSlot({
  placement = 'SIDEBAR_BANNER',
  limit = 2,
}: {
  placement?: SponsoredCourseAd['placement']
  limit?: number
}) {
  const { data } = useSponsoredAds()
  const activeAds = (data ?? []).filter((a) => a.active && (a.placement === placement || a.placement === 'CATALOG_CARD')).slice(0, limit)

  if (activeAds.length === 0) return null

  const openAd = (ad: SponsoredCourseAd) => {
    trainingService.trackAdClick(ad.id).catch(() => undefined)
    window.open(ad.targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="space-y-3" aria-label="Cursos patrocinados">
      {activeAds.map((ad) => (
        <MotionCard key={ad.id} className="overflow-hidden border-gold/60 bg-gradient-to-br from-white to-gold-50/40 p-4">
          <BissauStripe className="mb-2.5 h-0.5 rounded-full" />
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-bissau-yellow">
              <Megaphone className="h-3 w-3" aria-hidden />
              Patrocinado
            </span>
            <span className="text-[11px] font-semibold text-ink-muted">{ad.partnerName}</span>
          </div>

          <h3 className="mt-2 text-sm font-extrabold text-ink">{ad.courseTitle}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-ink-muted">{ad.description}</p>

          <div className="mt-3 flex items-center justify-between text-[11px] text-ink-muted">
            <span><MapPin className="mr-0.5 inline h-3 w-3 text-bissau-red" />{REGION_LABELS[ad.region]} · {ad.mode}</span>
            {ad.coursePriceXof && <span className="font-bold text-brand">{formatXOF(ad.coursePriceXof)}</span>}
          </div>

          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => openAd(ad)} className="btn-primary flex-1 py-1.5 text-xs">
              Inscrever-se <ExternalLink className="h-3.5 w-3.5" />
            </button>
            {ad.whatsapp && (
              <a
                href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trainingService.trackAdClick(ad.id).catch(() => undefined)}
                className="btn-accent px-2.5 py-1.5 text-xs"
                aria-label="WhatsApp do anunciante"
              >
                <MessageCircle className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </MotionCard>
      ))}
    </div>
  )
}

