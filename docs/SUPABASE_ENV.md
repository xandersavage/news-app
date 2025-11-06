Supabase environment variables (place into `.env.local` at project root)

# Public keys (safe for client-side usage)

NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-public-key"

# Server-only key (DO NOT commit this to source control)

# Only set this in your deployment secrets (Vercel/GitHub Actions/etc.) if you need

# server-side admin operations. Keep it secret.

SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Notes

- Use the public keys for client-side sign-in and public reads.
- Use the service role key only on trusted server-side runtime for admin writes or migrations.
- Do NOT paste or share service role keys in public chat.

Example `.env.local` (do not commit):

NEXT_PUBLIC_SUPABASE_URL=${""}"https://your-project-ref.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY=${""}"eyJhbGci..."
