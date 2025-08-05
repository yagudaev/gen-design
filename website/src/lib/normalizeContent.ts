import { resolveUrl } from '@workspace/shared/utils'

export function normalizeDisplayedText(content: string, url: string | null) {
  return (
    content
      .replace(/\[!\[([^\]]*)\]\(([^\)]+)\)\](\([^)]*\))/g, '![$1]($2)') // remove links around images think <a><img/></a>
      // change markdown urls to be absolute if they arent already
      .replace(/\[([^\]]*)\]\(([^)]+)\)/g, (match, text, link) => {
        if (!url) return match
        if (link.startsWith('http')) {
          return match
        }

        const resolvedUrl = resolveUrl(link, url)

        return `[${text}](${resolvedUrl})`
      })
      // remove links without any text in them, likely an error or anchor. Either way won't render in markdown
      .replace(/(?<!\!)\[(?![^\[]+\]\([^)]*\))\]\([^)]*\)/g, '')
      .trim()
  )
}

export function normalizeSpokenText(content: string) {
  return content
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1') // remove links
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '') // remove images
    .replace(/[#*`]/g, '') // strip all markdown syntax
}
