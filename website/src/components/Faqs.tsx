import Image from 'next/image'

import { MarketingContainer } from '@/components/MarketingContainer'
import backgroundImage from '@/images/background-faqs.jpg'

const faqs = [
  [
    {
      question: 'Do I own the outputted audio files?',
      answer:
        'Yes, all outputs from Vibeflow are owned by the person who created them. You can use them for any purpose, including commercial use.',
    },
    {
      question: 'Is there a free trial?',
      answer:
        'Yes, we offer a free trial with limited credits so you can experience the quality of Vibeflow before committing.',
    },
    {
      question: 'Can I get a refund if I’m not satisfied?',
      answer:
        'We offer refunds within the first 7 days of purchase, provided you haven’t used more than a certain amount of credits. Please refer to our refund policy for details.',
    },
  ],
  [
    {
      question: 'What makes Vibeflow different from other TTS services?',
      answer:
        'Vibeflow uses advanced AI models to produce voices that are significantly more natural and expressive than traditional text-to-speech systems.',
    },
    {
      question: 'What languages are supported?',
      answer:
        'Currently, Vibeflow supports a wide range of languages and accents. Check our documentation for the full list.',
    },
    {
      question: 'Is there a limit to the length of text I can convert?',
      answer:
        'While individual requests might have limits for performance reasons, Vibeflow is designed to handle long-form content like audiobooks efficiently.',
    },
  ],
  [
    {
      question: 'How are credits calculated?',
      answer:
        'Credits are generally based on the number of characters converted. Specific high-fidelity models or features like voice cloning might consume credits differently.',
    },
    {
      question: 'Do credits expire?',
      answer:
        'Purchased credits typically have a long expiry period (e.g., one year). Check the specifics when you purchase.',
    },
    {
      question: 'Is it pay-as-you-go or subscription-based?',
      answer:
        'Vibeflow primarily operates on a pay-as-you-go credit system, offering flexibility. We may introduce subscription plans in the future.',
    },
  ],
]

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative py-20 overflow-hidden bg-slate-50 sm:py-32"
    >
      {/* <Image
        className="absolute left-1/2 top-0 max-w-none -translate-y-1/4 translate-x-[-30%]"
        src={backgroundImage}
        alt=""
        width={1558}
        height={946}
        unoptimized
      /> */}
      <MarketingContainer className="relative">
        <div className="max-w-2xl mx-auto lg:mx-0">
          <h2
            id="faq-title"
            className="text-3xl tracking-tight font-display text-slate-900 sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            If you can’t find what you’re looking for, email our support team
            and if you’re lucky someone will get back to you.
          </p>
        </div>
        <ul
          role="list"
          className="grid max-w-2xl grid-cols-1 gap-8 mx-auto mt-16 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="flex flex-col gap-y-8">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg leading-7 font-display text-slate-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </MarketingContainer>
    </section>
  )
}
