import type { FC } from 'react'
import { useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { Experience } from './components/Experience'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import config from './config/portfolio.config'

const App: FC = () => {
  useEffect(() => {
    document.title = `${config.name} -- Portafolio`
  }, [])

  return (
    <div className="min-h-screen bg-bg text-text antialiased font-sans">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}

export default App
