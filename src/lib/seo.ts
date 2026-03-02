export type CreateMetaInput = {
  /**
   * Judul halaman (tanstack memakai meta item { title }).
   * Contoh: "My App - Home"
   */
  title: string

  /** Meta description untuk SEO. */
  description?: string

  /**
   * URL absolut halaman (dipakai untuk canonical & og:url).
   * Contoh: "https://myapp.com/posts/123"
   */
  url?: string

  /**
   * URL absolut gambar untuk OG/Twitter.
   * Contoh: "https://myapp.com/cover.png"
   */
  image?: string

  /** Tipe OG, default: 'website' */
  ogType?: 'website' | 'article'

  /** Twitter card type, default: 'summary_large_image' */
  twitterCard?: 'summary' | 'summary_large_image'

  /**
   * Structured data (JSON-LD). Akan dimasukkan sebagai script application/ld+json.
   * Berikan object siap stringify.
   */
  jsonLd?: Record<string, unknown>

  /**
   * Robots meta (opsional). Contoh: "noindex, nofollow"
   * Kalau tidak diisi, tidak akan menambah tag robots.
   */
  robots?: string
}

type HeadMetaItem =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

type HeadLinkItem = { rel: string; href: string }

type HeadScriptItem = { type: string; children: string }

export type HeadResult = {
  meta: HeadMetaItem[]
  links?: HeadLinkItem[]
  scripts?: HeadScriptItem[]
}

/**
 * Helper untuk membangun `head()` object TanStack Start:
 * - meta: title, description, OG, Twitter, robots
 * - links: canonical (jika url diberikan)
 * - scripts: JSON-LD (jika jsonLd diberikan)
 */
export function createMeta(input: CreateMetaInput): HeadResult {
  const {
    title,
    description,
    url,
    image,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    jsonLd,
    robots,
  } = input

  const meta: HeadMetaItem[] = [{ title }]

  if (description) {
    meta.push({ name: 'description', content: description })
  }

  if (robots) {
    meta.push({ name: 'robots', content: robots })
  }

  // Open Graph
  meta.push({ property: 'og:title', content: title })
  meta.push({ property: 'og:type', content: ogType })

  if (description) meta.push({ property: 'og:description', content: description })
  if (url) meta.push({ property: 'og:url', content: url })
  if (image) meta.push({ property: 'og:image', content: image })

  // Twitter
  meta.push({ name: 'twitter:card', content: twitterCard })
  meta.push({ name: 'twitter:title', content: title })
  if (description) meta.push({ name: 'twitter:description', content: description })
  if (image) meta.push({ name: 'twitter:image', content: image })

  const links: HeadLinkItem[] = []
  if (url) {
    links.push({ rel: 'canonical', href: url })
  }

  const scripts: HeadScriptItem[] = []
  if (jsonLd) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify(jsonLd),
    })
  }

  return {
    meta,
    links: links.length ? links : undefined,
    scripts: scripts.length ? scripts : undefined,
  }
}
