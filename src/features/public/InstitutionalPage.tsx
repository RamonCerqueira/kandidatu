import { Link, useParams } from 'react-router-dom'
import { Seo } from '../../components/shared/Seo'
import ContactForm from './ContactForm'

interface Page { title: string; intro: string; sections: { h: string; p: string }[]; cta?: { to: string; label: string } }

export const INSTITUTIONAL: Record<string, Page> = {
  sobre: {
    title: 'Sobre a KANDIDATU',
    intro: 'Uma plataforma de recrutamento criada para a Guiné-Bissau e preparada para crescer na região.',
    sections: [
      { h: 'A nossa missão', p: 'Aproximar pessoas que procuram trabalho de empresas, ONGs, instituições públicas, organismos internacionais e centros de formação, de forma transparente e acessível.' },
      { h: 'Para todo o país', p: 'A plataforma cobre as nove regiões: Bissau, Bafatá, Gabú, Cacheu, Oio, Biombo, Quinara, Tombali e Bolama/Bijagós.' },
    ],
  },
  'como-funciona': {
    title: 'Como funciona',
    intro: 'Três passos simples, para candidatos e empresas.',
    sections: [
      { h: '1. Crie o seu perfil', p: 'Candidatos criam o currículo; empresas registam a organização e aguardam a verificação.' },
      { h: '2. Encontre ou publique', p: 'Pesquise vagas por região, área e contrato, ou publique uma vaga em poucas etapas.' },
      { h: '3. Candidate-se e acompanhe', p: 'Acompanhe o estado de cada candidatura, de "enviada" até à decisão final.' },
    ],
    cta: { to: '/vagas', label: 'Ver vagas' },
  },
  'para-empresas': {
    title: 'Para empresas',
    intro: 'Recrute com mais rapidez e confiança.',
    sections: [
      { h: 'Chegue ao talento certo', p: 'Publique vagas e receba candidaturas organizadas por estado.' },
      { h: 'Empresa verificada', p: 'A verificação da sua organização reforça a confiança dos candidatos.' },
      { h: 'Gestão do processo', p: 'Acompanhe candidatos, agende entrevistas e registe observações internas.' },
    ],
    cta: { to: '/entrar', label: 'Entrar para publicar vaga' },
  },
  'para-candidatos': {
    title: 'Para candidatos',
    intro: 'Dê visibilidade ao seu talento.',
    sections: [
      { h: 'Currículo profissional', p: 'Monte o seu currículo online e candidate-se com um clique.' },
      { h: 'Alertas e acompanhamento', p: 'Receba notificações sobre vagas compatíveis e mudanças nas candidaturas.' },
      { h: 'Gratuito', p: 'Candidatar-se não tem custo para si.' },
    ],
    cta: { to: '/vagas', label: 'Encontrar emprego' },
  },
  privacidade: {
    title: 'Política de privacidade',
    intro: 'Texto provisório — deve ser revisto por responsável jurídico antes da publicação.',
    sections: [
      { h: 'Dados recolhidos', p: 'Dados de perfil, currículo e candidaturas, necessários para o funcionamento do serviço.' },
      { h: 'Os seus direitos', p: 'Pode pedir acesso, correção ou eliminação dos seus dados através da página de contacto.' },
    ],
  },
  termos: {
    title: 'Termos de utilização',
    intro: 'Texto provisório — deve ser revisto por responsável jurídico antes da publicação.',
    sections: [
      { h: 'Uso da plataforma', p: 'Os utilizadores comprometem-se a fornecer informação verdadeira e a não publicar conteúdo enganoso.' },
      { h: 'Moderação', p: 'Vagas e empresas podem ser analisadas, recusadas ou removidas pela administração.' },
    ],
  },
}

export default function InstitutionalPage({ slug: forced }: { slug?: string }) {
  const params = useParams()
  const slug = forced ?? params.slug ?? 'sobre'

  if (slug === 'contacto') {
    return (
      <div className="mx-auto max-w-xl px-4 py-12">
        <Seo title="Contacto" description="Fale com a equipa KANDIDATU." />
        <h1 className="text-2xl font-bold">Contacto</h1>
        <p className="mb-6 mt-2 text-ink-muted">Dúvidas, sugestões ou pedidos sobre os seus dados.</p>
        <ContactForm />
      </div>
    )
  }
  const page = INSTITUTIONAL[slug]
  if (!page) return <div className="p-12 text-center">Página não encontrada. <Link to="/" className="text-brand underline">Início</Link></div>
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <Seo title={page.title} description={page.intro} />
      <h1 className="text-3xl font-extrabold tracking-tight">{page.title}</h1>
      <p className="mt-2 text-lg text-ink-muted">{page.intro}</p>
      {page.sections.map((s) => (
        <section key={s.h} className="mt-8"><h2 className="font-semibold">{s.h}</h2><p className="mt-1 text-sm leading-relaxed">{s.p}</p></section>
      ))}
      {page.cta && <Link to={page.cta.to} className="btn-accent mt-10">{page.cta.label}</Link>}
    </article>
  )
}

