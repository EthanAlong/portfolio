// Server layout: per-project title, description and share image, generated
// from the same data the (client) project page renders.
import { projects } from "@/data/projects"

const clip = (s, n = 180) => (s && s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s || "")

export async function generateMetadata({ params }) {
  const { id } = await params
  const p = projects.find((x) => x.id === id)
  if (!p) return { title: "Project" }
  const title = (Array.isArray(p.title) ? p.title.join(" ") : p.title).replace(/\s+/g, " ").trim()
  const image = p.mainImage || p.ringImage
  return {
    title,
    description: clip(p.description),
    openGraph: {
      title: `${title} · Ethan Huang`,
      description: clip(p.description),
      url: `/project/${p.id}`,
      images: image && image.startsWith("/") ? [{ url: image, alt: title }] : undefined,
    },
  }
}

export default function ProjectLayout({ children }) {
  return children
}
