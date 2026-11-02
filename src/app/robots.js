export default function robots() {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/preview/' },
    sitemap: 'https://www.ethanhdigital.com/sitemap.xml',
  }
}
