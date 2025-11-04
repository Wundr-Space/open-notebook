'use client'

import Link from 'next/link'
import { Brain, CheckCircle2 } from 'lucide-react'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { Step1OrganizationDetails } from '@/components/onboarding/Step1OrganizationDetails'
import { Step2AdminAccount } from '@/components/onboarding/Step2AdminAccount'
import { Step3InstanceConfiguration } from '@/components/onboarding/Step3InstanceConfiguration'
import { Step4ReviewDeploy } from '@/components/onboarding/Step4ReviewDeploy'

const steps = [
  { number: 1, title: 'Organization', shortTitle: 'Org' },
  { number: 2, title: 'Admin Account', shortTitle: 'Admin' },
  { number: 3, title: 'Configuration', shortTitle: 'Config' },
  { number: 4, title: 'Review & Deploy', shortTitle: 'Deploy' },
]

export default function OnboardingPage() {
  const { currentStep } = useOnboardingStore()

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
          <div className="container mx-auto max-w-4xl px-6 py-16">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-2 flex-shrink-0">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${
                          currentStep > step.number
                            ? 'border-emerald-400 bg-emerald-400 text-[#0b1220]'
                            : currentStep === step.number
                              ? 'border-emerald-400 bg-gradient-to-br from-emerald-400 to-teal-400 text-[#0b1220]'
                              : 'border-white/20 bg-[#0e1526] text-slate-400'
                        }`}
                      >
                        {currentStep > step.number ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{step.number}</span>
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className={`text-xs md:text-sm font-medium transition-all ${
                            currentStep >= step.number ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          <span className="hidden sm:inline">{step.title}</span>
                          <span className="sm:hidden">{step.shortTitle}</span>
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 transition-all ${
                          currentStep > step.number ? 'bg-emerald-400' : 'bg-white/10'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Step Content */}
            <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-6 md:p-10">
              {currentStep === 1 && <Step1OrganizationDetails />}
              {currentStep === 2 && <Step2AdminAccount />}
              {currentStep === 3 && <Step3InstanceConfiguration />}
              {currentStep === 4 && <Step4ReviewDeploy />}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
