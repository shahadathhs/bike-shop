import { Input } from '~/components/ui/input'
import { useSearchParams, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useDebounce } from '~/utils/debounce'

export function OrderSearch() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [term, setTerm] = useState(searchParams.get('searchTerm') ?? '')
  const debouncedTerm = useDebounce(term, 500)

  // effect to navigate on debounce
  useEffect(() => {
    const p = new URLSearchParams(searchParams)
    if (debouncedTerm) p.set('searchTerm', debouncedTerm)
    else p.delete('searchTerm')
    p.set('page', '1')
    navigate(`?${p}`)
  }, [debouncedTerm])

  return (
    <Input
      type="text"
      value={term}
      onChange={e => setTerm(e.target.value)}
      placeholder="Search orders by name, category, or brand"
    />
  )
}
