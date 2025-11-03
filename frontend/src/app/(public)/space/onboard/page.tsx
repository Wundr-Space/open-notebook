import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, ArrowLeft } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/space" className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Wundr Space</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="container max-w-2xl text-center space-y-8 py-16">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Onboarding Wizard
            </h1>
            <p className="text-lg text-muted-foreground">
              Phase 2: Multi-step wizard coming soon!
            </p>
          </div>

          <div className="rounded-lg border p-8 space-y-6 text-left">
            <h2 className="text-2xl font-semibold">What&apos;s Next:</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold">Organization Details</h3>
                  <p className="text-sm text-muted-foreground">Name, domain, description</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold">Admin Account</h3>
                  <p className="text-sm text-muted-foreground">Your admin credentials</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold">Instance Configuration</h3>
                  <p className="text-sm text-muted-foreground">Subdomain and preferences</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold">Review & Deploy</h3>
                  <p className="text-sm text-muted-foreground">Automated provisioning</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link href="/space">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Landing Page
              </Link>
            </Button>
            <Button asChild>
              <Link href="mailto:contact@wundr.space">
                Contact Us for Early Access
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
