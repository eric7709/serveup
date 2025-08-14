// shared/lib/supabaseServer.ts
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function supabaseServer() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const request = new Request(baseUrl)
  const response = new Response()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // This won't work in middleware - see fix below
          return undefined
        },
        set(name: string, value: string, options: any) {
          // This won't work in middleware
        },
        remove(name: string, options: any) {
          // This won't work in middleware
        },
      },
    }
  )

  return supabase
}