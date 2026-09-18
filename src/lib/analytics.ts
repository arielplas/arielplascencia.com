import { track } from '@vercel/analytics/react'

export type CtaName =
  | 'nav_hire'
  | 'hero_work'
  | 'hero_resume'
  | 'hero_contact'
  | 'about_email'
  | 'contact_submit'
  | 'contact_mailto'
  | 'project_live'
  | 'project_repo'
  | 'social'

/** Fire a Vercel Analytics custom event. Never throws; analytics must not break the page. */
export const trackCta = (name: CtaName, props?: Record<string, string | number | boolean>) => {
  try {
    track(name, props)
  } catch {
    // ignore: analytics blocked or not loaded
  }
}
