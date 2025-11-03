'use client'

import { ConnectionGuard } from '@/components/common/ConnectionGuard'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ConnectionGuard>{children}</ConnectionGuard>
}
