import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  type?: string
  canonical?: string
}

export function SEO({
  title = 'WikiGames - Real-time Gaming Analytics & Player Statistics',
  description = 'Track real-time player counts, tournament updates, and gaming news for popular games like CS:GO, Dota 2, PUBG, and more. Free gaming analytics dashboard with live data.',
  keywords = 'gaming statistics, player count, esports, CS:GO stats, Dota 2 stats, PUBG stats, game analytics, tournament tracker, gaming news',
  image = 'https://og-image.vercel.app/**WikiGames%20Analytics**%20%F0%9F%8E%AE.png?theme=dark&md=1&fontSize=100px',
  type = 'website',
  canonical
}: SEOProps) {
  const location = useLocation()
  
  useEffect(() => {
    // Update document title
    document.title = title
    
    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let element = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement
      if (element) {
        element.content = content
      }
    }
    
    const updateProperty = (property: string, content: string) => {
      let element = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement
      if (element) {
        element.content = content
      }
    }
    
    // Update basic meta
    updateMeta('description', description)
    updateMeta('keywords', keywords)
    
    // Update Open Graph
    updateProperty('og:title', title)
    updateProperty('og:description', description)
    updateProperty('og:image', image)
    updateProperty('og:type', type)
    updateProperty('og:url', `https://wikigames.org${location.pathname}`)
    
    // Update Twitter Card
    updateProperty('twitter:title', title)
    updateProperty('twitter:description', description)
    updateProperty('twitter:image', image)
    updateProperty('twitter:url', `https://wikigames.org${location.pathname}`)
    
    // Update canonical URL
    const canonicalElement = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
    if (canonicalElement) {
      canonicalElement.href = canonical || `https://wikigames.org${location.pathname}`
    }
  }, [title, description, keywords, image, type, canonical, location.pathname])
  
  return null
}
