import { createClient } from '@supabase/supabase-js'

// The client adds /rest/v1, /auth/v1 etc. itself, so keep only the origin: a URL copied
// with a path (".../rest/v1/") would otherwise fail with "Invalid path specified in request URL".
const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const url = rawUrl ? new URL(rawUrl).origin : ''
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// null when the env vars are missing: the site then shows the bundled seed content.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const BUCKET = 'portfolio'

// Images can be full URLs (Supabase Storage) or paths inside /public.
export function assetUrl(path) {
  if (!path) return ''
  if (/^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
