const settings: Settings = {
  isDevelopment: process.env.NODE_ENV === 'development',
  earlyAccessUrl: '/register',
  crisp: {
    id: 'f6cbaa7b-ebed-495d-83c3-0fd525632085',
    // onlyShowOnRoutes: [],
  },
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL as string,
}

export interface Settings {
  earlyAccessUrl: string
  crisp: {
    id: string
    onlyShowOnRoutes?: string[]
  }
  baseUrl: string
  isDevelopment: boolean
}

export default settings
