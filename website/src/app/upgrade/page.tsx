'use client'

import { useEffect, useState } from 'react'

import { Header } from '@/components/Header'
import { MarketingFooter } from '@/components/MarketingFooter'
import { Pricing } from '@/components/Pricing'
import { Button } from '@/components/ui/button'



export default function CheckoutSuccess() {
  return (
    <>
      <Header />
      <Pricing />
      <MarketingFooter />
    </>
  )
}
