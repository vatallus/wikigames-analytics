import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from './ui/card'

const faqs = [
  {
    question: "What is WikiGames?",
    answer: "WikiGames is a real-time gaming analytics platform that tracks player counts, trends, and statistics for 30+ popular games. We aggregate data from multiple free sources including Steam API and SteamSpy to provide comprehensive gaming insights."
  },
  {
    question: "Is the data real-time?",
    answer: "Yes! Our data updates every 30 seconds via WebSocket connections. We pull live player counts from Steam API and enrich it with additional metrics from SteamSpy, giving you the most up-to-date gaming statistics available."
  },
  {
    question: "Which games do you track?",
    answer: "We currently track 30+ games across multiple genres including CS2, Dota 2, PUBG, GTA V, Rust, Apex Legends, Destiny 2, Lost Ark, and many more. All games are automatically tracked with live player counts and detailed statistics."
  },
  {
    question: "Is WikiGames free to use?",
    answer: "Absolutely! WikiGames is 100% free to use. All features including real-time data, analytics, leaderboards, and game comparisons are available without any subscription or payment. We support the platform through optional donations."
  },
  {
    question: "How accurate is the player count data?",
    answer: "Our player count data comes directly from Steam's official API, making it highly accurate. We track concurrent players (currently online) rather than total owners or monthly players, giving you real-time insights into game popularity."
  },
  {
    question: "Can I compare multiple games?",
    answer: "Yes! Use our comparison feature to compare up to 3 games side-by-side. You can analyze player counts, review scores, playtime statistics, and more to see how games stack up against each other."
  },
  {
    question: "Do you have an API?",
    answer: "Currently, we don't offer a public API, but we're considering it for future releases. For now, you can use our web interface to access all gaming data and analytics."
  },
  {
    question: "How can I support WikiGames?",
    answer: "We appreciate your support! You can help us by sharing WikiGames with your gaming community, following us on social media, or making an optional donation via cryptocurrency. Every contribution helps us maintain and improve the platform."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">Everything you need to know about WikiGames</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-4 text-left flex items-start justify-between gap-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
              </div>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        ))}
      </div>
    </div>
  )
}
