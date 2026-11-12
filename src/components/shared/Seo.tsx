import { useEffect } from 'react'

interface SeoProps { title: string; description?: string }

export function Seo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = `${title} · KANDIDATU`
    if (description) {
      let m = document.querySelector<HTMLMetaElement>('meta[name="description"]')
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m) }
      m.content = description
    }
  }, [title, description])
  return null
}

