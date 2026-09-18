import { lazy, Suspense } from 'react'
import type { FC } from 'react'
import { Analytics } from '@vercel/analytics/react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Skills } from './components/Skills'
import { Footer } from './components/Footer'

// Below-the-fold sections load in their own chunks so the hero paints sooner.
const Projects = lazy(() => import('./components/Projects').then((m) => ({ default: m.Projects })))
const Experience = lazy(() =>
  import('./components/Experience').then((m) => ({ default: m.Experience }))
)
const Contact = lazy(() => import('./components/Contact').then((m) => ({ default: m.Contact })))

/** Fixed-height placeholder so lazy sections do not shift layout while loading. */
const Placeholder: FC = () => <div className="min-h-[60vh]" aria-hidden="true" />

const App: FC = () => {
  return (
    <div className="min-h-screen bg-bg text-text antialiased font-sans">
      <Navbar />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Suspense fallback={<Placeholder />}>
          <Projects />
          <Experience />
          <Contact />
        </Suspense>
      </main>
      <Footer />
      <Analytics />
    </div>
  )
}

export default App
