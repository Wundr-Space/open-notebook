import Link from 'next/link'
import { Brain, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#0b1220] text-white">
      {/* Radial gradient background */}
      <div className="fixed inset-0 bg-[radial-gradient(1000px_600px_at_20%_-10%,rgba(99,102,241,0.25),transparent),radial-gradient(1000px_600px_at_80%_110%,rgba(16,185,129,0.2),transparent)] pointer-events-none" />

      <div className="relative">
        {/* Navigation */}
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b1220]/70 backdrop-blur">
          <div className="container mx-auto max-w-7xl flex h-16 items-center justify-between px-6">
            <Link href="/space" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 p-1">
                <Brain className="h-5 w-5 text-[#0b1220]" />
              </div>
              <span className="text-lg font-semibold tracking-tight">Wundr Space</span>
            </Link>
          </div>
        </header>

        <main className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto max-w-2xl px-6 py-16">
            <div className="text-center space-y-6 mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300">
                <CheckCircle2 className="h-3 w-3" />
                <span>Phase 2 Coming Soon</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                Onboarding Wizard
              </h1>
              <p className="text-lg text-slate-300">
                Multi-step wizard to provision your Knowledge Space
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-8 md:p-10 space-y-8">
              <h2 className="text-2xl font-semibold">What&apos;s Next:</h2>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Organization Details',
                    description: 'Name, domain, description'
                  },
                  {
                    step: 2,
                    title: 'Admin Account',
                    description: 'Your admin credentials'
                  },
                  {
                    step: 3,
                    title: 'Instance Configuration',
                    description: 'Subdomain and preferences'
                  },
                  {
                    step: 4,
                    title: 'Review & Deploy',
                    description: 'Automated provisioning'
                  }
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 text-[#0b1220] text-sm font-semibold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link href="/space">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Landing Page
                </button>
              </Link>
              <a href="mailto:contact@wundr.space">
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-[#0b1220] font-semibold hover:opacity-90 transition-all shadow-lg shadow-emerald-400/10">
                  Contact Us for Early Access
                </button>
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
