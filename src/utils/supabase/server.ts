import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// createClient for server-side usage (Server Components / Route Handlers)
// Keep the implementation minimal: we provide a `get` accessor so
// supabase-js can read the session cookie when needed. `set`/`remove`
// are no-ops here because cookie mutation should happen in route
// handlers/middleware where response cookies are available.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            return cookieStore.get(name)?.value;
          } catch {
            return undefined;
          }
        },
        set() {
          // no-op in Server Component context
        },
        remove() {
          // no-op in Server Component context
        },
      },
    }
  );
}
