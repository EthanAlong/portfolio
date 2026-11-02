import React from 'react'
import Link from 'next/link'
import { aboutStory } from '@/data/about'

/** Renders **bold** spans inside a plain string. */
function rich(text) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : <React.Fragment key={i}>{part}</React.Fragment>
  )
}

/**
 * The About paragraphs, shared by the desktop and mobile layouts.
 * `className` / `gap` match each layout's existing paragraph styling.
 */
export default function AboutStory({ className, gap = '2rem' }) {
  const last = aboutStory.length - 1
  return aboutStory.map((text, i) => (
    <p key={i} className={className} style={i < last ? { marginBottom: gap } : undefined}>
      {rich(text)}
      {i === last && (
        <>
          {' '}
          <Link href="/engineering" style={{ color: 'inherit', fontWeight: 600 }}>See the Engineering page →</Link>
        </>
      )}
    </p>
  ))
}
