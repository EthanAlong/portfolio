// /sitemap.xml: every page and every real project (no archive placeholders).
import { projects } from '@/data/projects'

const SITE = 'https://www.ethanhdigital.com'

export default function sitemap() {
  const pages = ['', '/engineering', '/about'].map((p) => ({
    url: `${SITE}${p}`,
    changeFrequency: 'monthly',
    priority: p === '' ? 1 : p === '/engineering' ? 0.9 : 0.6,
  }))
  const work = projects
    .filter((p) => !p.id.startsWith('archive-'))
    .map((p) => ({ url: `${SITE}/project/${p.id}`, changeFrequency: 'yearly', priority: 0.5 }))
  return [...pages, ...work]
}
