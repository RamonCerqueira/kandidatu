import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type LocaleCode = 'pt-GW' | 'gwc' | 'fr'

const DICT: Record<LocaleCode, {
  navHome: string
  navJobs: string
  navCompanies: string
  navTraining: string
  navAbout: string
  postJob: string
  login: string
  myArea: string
  slogan: string
}> = {
  'pt-GW': {
    navHome: 'Início',
    navJobs: 'Encontrar emprego',
    navCompanies: 'Empresas',
    navTraining: 'Cursos & Formação',
    navAbout: 'Sobre nós',
    postJob: 'Publicar vaga',
    login: 'Entrar',
    myArea: 'A minha área',
    slogan: 'Plataforma digital de talentos e oportunidades profissionais da Guiné-Bissau',
  },
  gwc: {
    navHome: 'Kasa',
    navJobs: 'Buska tarbadju',
    navCompanies: 'Emprezas',
    navTraining: 'Kursus & Formason',
    navAbout: 'Sobri nos',
    postJob: 'Publika vaga',
    login: 'Yentra',
    myArea: 'Nha área',
    slogan: 'Plataforma digital di talentus ku oportunidadis di tarbadju na Guiné-Bissau',
  },
  fr: {
    navHome: 'Accueil',
    navJobs: 'Trouver un emploi',
    navCompanies: 'Entreprises',
    navTraining: 'Cours & Formation',
    navAbout: 'À propos',
    postJob: 'Publier une offre',
    login: 'Connexion',
    myArea: 'Mon espace',
    slogan: 'Plateforme numérique de talents et d’opportunités professionnelles en Guinée-Bissau',
  },
}

interface LocaleContextValue {
  locale: LocaleCode
  setLocale: (l: LocaleCode) => void
  t: (typeof DICT)['pt-GW']
}

const STORAGE_KEY = 'kandidatu.locale'
const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LocaleCode | null
    return saved && DICT[saved] ? saved : 'pt-GW'
  })

  const setLocale = (l: LocaleCode) => {
    localStorage.setItem(STORAGE_KEY, l)
    setLocaleState(l)
  }

  const value = useMemo(() => ({ locale, setLocale, t: DICT[locale] }), [locale])
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale deve ser usado dentro de LocaleProvider')
  return ctx
}

