import { env } from '~/env.mjs'

export default function getBaseUrl(): string {
  // if window is undefined, we are in SSR mode
  // then return env.NEXT_PUBLIC_BASE_URL
  if (typeof window === 'undefined') {
    const val = env.NEXT_PUBLIC_BASE_URL

    if (!val) {
      throw new Error('NEXT_PUBLIC_BASE_URL is not defined')
    }

    return val
  }

  return window.location.origin
}
