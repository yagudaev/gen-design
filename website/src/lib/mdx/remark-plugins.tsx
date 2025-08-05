import Link from 'next/link'

export function replaceLinks({ children, href }: any) {
  return href.startsWith('/') || href === '' ? (
    <Link href={href}>
      <a className="cursor-pointer">{children}</a>
    </Link>
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} ↗
    </a>
  )
}
