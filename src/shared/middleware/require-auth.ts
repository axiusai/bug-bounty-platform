import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { ApiContext } from "@/shared/types";
import { UnauthorizedError } from "@/shared/errors";

/**
 * Validates JWT and returns authenticated user context.
 * Use in route handlers - throws UnauthorizedError if not authenticated.
 */
export async function requireAuth(): Promise<ApiContext> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: unknown }[]) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options as Parameters<typeof cookieStore.set>[2])
          );
        },
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new UnauthorizedError("Invalid or expired session");
  }

  // Default role - modules can enrich with org-specific roles
  const role = (user.user_metadata?.role as ApiContext["role"]) ?? "hacker";

  return {
    userId: user.id,
    role,
  };
}
