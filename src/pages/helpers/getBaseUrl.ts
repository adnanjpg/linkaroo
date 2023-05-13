import { env } from '~/env.mjs'

export default function getBasrUrl(): string {
  // if window is undefined, we are in SSR mode
  // then return env.BASE_URL
  if (typeof window === 'undefined') {
    return env.NEXT_PUBLIC_BASE_URL
  }

  return window.location.origin
}
