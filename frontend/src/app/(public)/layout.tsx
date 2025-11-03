/**
 * Public Layout
 *
 * This layout wraps public routes that don't require authentication.
 * No ConnectionGuard, no auth checks - purely public pages.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
