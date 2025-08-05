import { Header } from '@/components/Header'
import { MarketingFooter } from '@/components/MarketingFooter'

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      {children}
      <MarketingFooter />
    </>
  )
}
