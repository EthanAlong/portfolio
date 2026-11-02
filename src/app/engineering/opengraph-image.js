// Share card for /engineering (LinkedIn, Slack, iMessage, email previews).
// Rendered once at build time by next/og; same look as the page hero:
// white, heavy black type, one blue dot for "data".
import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Find the pain. Ship the fix. Measure it. Ethan Huang, Engineering'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BLUE = '#0071e3'

// Inter (SIL OFL 1.1, fonts/OFL-Inter.txt): next/og's built-in font has no
// heavy weight, and the card has to match the page's 900-weight headline.
const font = (file) => readFile(join(process.cwd(), 'src/app/engineering/fonts', file))

export default async function OpengraphImage() {
  const [black, medium] = await Promise.all([font('inter-latin-900-normal.woff'), font('inter-latin-500-normal.woff')])
  const stats = [
    ['8', 'tools in production'],
    ['9', 'daily users'],
    ['89×', 'return on run cost'],
    ['AZ-104', 'Azure certified'],
  ]
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '64px 72px',
          fontFamily: 'Inter',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: 2 }}>ETHANDIGITAL</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 22, fontWeight: 500, color: '#6e6e73', letterSpacing: 3 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: BLUE }} />
            ENGINEERING
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 92, fontWeight: 900, lineHeight: 0.98, letterSpacing: -3 }}>
          <div>FIND THE PAIN.</div>
          <div>SHIP THE FIX.</div>
          <div>MEASURE IT.</div>
        </div>

        <div style={{ display: 'flex', borderTop: '3px solid #000', paddingTop: 22 }}>
          {stats.map(([v, l], i) => (
            <div key={l} style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: i ? 24 : 0, borderLeft: i ? '1px solid #e6e6e6' : 'none' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: i === 3 ? BLUE : '#000' }}>{v}</div>
              <div style={{ fontSize: 18, fontWeight: 500, color: '#6e6e73', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Inter', data: black, weight: 900, style: 'normal' },
        { name: 'Inter', data: medium, weight: 500, style: 'normal' },
      ],
    }
  )
}
