const defaultUrl = 'https://www.audiowaveai.com'

export function openGraphTags(
  title: string,
  description: string,
  url: string,
  image: string,
  type: string = 'website',
) {
  return {
    openGraph: {
      type: type,
      url: url,
      title: title,
      description: description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description,
      image: {
        url: image,
        alt: title,
      },
      // site: '@yourusername',
    },
  }
}
