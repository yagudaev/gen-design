import { CallToAction } from '@/components/CallToAction'
import { Faqs } from '@/components/Faqs'
import { Header } from '@/components/Header'
import { Hero } from '@/components/landingPage/Hero'
import { MoreExamples } from '@/components/landingPage/MoreExamples'
// import { PrimaryFeatures } from '@/components/landingPage/PrimaryFeatures'
import { SecondaryFeatures } from '@/components/landingPage/SecondaryFeatures'
import { Testimonials } from '@/components/landingPage/Testimonials'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Offering } from '@/components/Offering'
import { Pricing } from '@/components/Pricing'

export default function Home() {
  return (
    <>
      <Header />
      <main className="grow">
        <Hero />
        {/* <PrimaryFeatures /> */}
        {/* <PrimaryFeatures /> */}

        {/* <SecondaryFeatures /> */}
        {/* <CallToAction /> */}
        {/* <Testimonials /> */}
        {/* <MoreExamples /> */}
        {/* <Pricing /> */}
        {/* <Faqs /> */}
        {/* <Offering /> */}
      </main>
      <MarketingFooter />
    </>
  )
}
