'use client'

import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { TextField } from './Fields'

export function SearchField() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams?.get('q')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (query) {
      if (query.trim() === '') {
        setSearchTerm('')
      } else {
        setSearchTerm(query)
      }
    }
  }, [query, router])

  return (
    <div className="relative flex-1 ml-auto md:grow-0">
      <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
      <TextField
        type="text"
        placeholder="Search..."
        inputClassName="w-full rounded-md bg-background pl-8 md:w-[200px] lg:w-[336px]"
        onChange={(event) => setSearchTerm(event.target.value)}
        value={searchTerm}
        onKeyDown={(event) => {
          if (event.key !== 'Enter') return
          if (searchTerm.trim() === '') {
            router.push('/projects')
          } else {
            router.push(`/search?q=${searchTerm}`)
          }
        }}
      />
      {searchTerm && (
        <X
          className="absolute right-2.5 top-3 w-4 h-4 text-muted-foreground cursor-pointer"
          onClick={() => {
            setSearchTerm('')
            router.push('/projects')
          }}
        />
      )}
    </div>
  )
}
