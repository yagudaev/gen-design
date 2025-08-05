import _ from 'lodash'

export default function parseHref(href: string) {
  const hash = href.split('#')[1]
  const url = href.split('#')[0]
  const prefix = url.split('/').slice(0, -1).join('/')
  const filename = _.last(url.split('/')) as string
  const name = filename.split('.').slice(0, -1).join('.')
  let ext = _.last(filename.split('.'))

  if (filename.indexOf('.') === -1) {
    ext = ''
  }

  return { hash, name, ext, prefix, url }
}
