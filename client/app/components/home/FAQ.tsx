import { useState, useMemo } from 'react'
import { faqData, type FAQ } from '~/constant/faqData'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '~/components/ui/accordion'
import { Input } from '~/components/ui/input'
import { Search } from 'lucide-react'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { BorderBeam } from '../magicui/border-beam'

export default function FAQ() {
  const [search, setSearch] = useState('')
  const filtered = useMemo<FAQ[]>(() => {
    const q = search.trim().toLowerCase()
    if (!q) return faqData
    return faqData.filter(
      f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q),
    )
  }, [search])

  return (
    <section className="relative md:py-10 md:border md:rounded overflow-hidden">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <motion.h2
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <motion.p
          className="mt-2 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.1 } }}
        >
          Can’t find what you’re looking for? Try searching below.
        </motion.p>

        <div className="relative mt-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search FAQs..."
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <motion.div
        className="max-w-3xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.05 } },
        }}
      >
        <Accordion type="single" collapsible>
          {filtered.map((f, idx) => (
            <AccordionItem
              key={nanoid()}
              value={`item-${idx}`}
              className="border-b last:border-none"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <AccordionTrigger className="py-4 text-lg font-medium">
                  {f.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-muted-foreground">
                  {f.answer}
                </AccordionContent>
              </motion.div>
            </AccordionItem>
          ))}
        </Accordion>

        {filtered.length === 0 && (
          <p className="mt-6 text-center text-gray-500">
            No results found for &quot;{search}&quot;.
          </p>
        )}
      </motion.div>

      <BorderBeam
        duration={30}
        size={300}
        reverse
        className="opacity-0 md:opacity-100 from-transparent via-green-500 to-transparent"
      />
    </section>
  )
}
