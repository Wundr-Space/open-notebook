'use client'

import Link from 'next/link'
import { Brain, CheckCircle, Mail, ExternalLink, Loader2 } from 'lucide-react'
import { useOnboardingStore } from '@/lib/stores/onboarding-store'
import { useEffect, useState } from 'react'

export default function SuccessPage() {
  const { organizationDetails, instanceConfiguration, resetWizard } = useOnboardingStore()
  const [provisioningStatus, setProvisioningStatus] = useState<
    'provisioning' | 'configuring' | 'finalizing' | 'complete'
  >('provisioning')

  const subdomain = instanceConfiguration.subdomain || 'your-org'
  const instanceUrl = `https://${subdomain}.hub.wundr.space`

  // Simulate provisioning progress
  useEffect(() => {
    const timer1 = setTimeout(() => setProvisioningStatus('configuring'), 2000)
    const timer2 = setTimeout(() => setProvisioningStatus('finalizing'), 4000)
    const timer3 = setTimeout(() => setProvisioningStatus('complete'), 6000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [])

  const steps = [
    {
      id: 'provisioning',
      label: 'Provisioning infrastructure on Google Cloud',
      completed: ['configuring', 'finalizing', 'complete'].includes(provisioningStatus),
    },
    {
      id: 'configuring',
      label: 'Configuring Firebase Authentication',
      completed: ['finalizing', 'complete'].includes(provisioningStatus),
    },
    {
      id: 'finalizing',
      label: 'Setting up your Knowledge Space',
      completed: provisioningStatus === 'complete',
    },
  ]

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
          <div className="container mx-auto max-w-3xl px-6 py-16">
            <div className="text-center space-y-8 mb-12">
              <div className="flex justify-center">
                <div className="rounded-full bg-emerald-500/20 p-6">
                  {provisioningStatus === 'complete' ? (
                    <CheckCircle className="h-16 w-16 text-emerald-400" />
                  ) : (
                    <Loader2 className="h-16 w-16 text-emerald-400 animate-spin" />
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
                  {provisioningStatus === 'complete'
                    ? '🎉 Your Knowledge Space is Ready!'
                    : 'Deploying Your Knowledge Space'}
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                  {provisioningStatus === 'complete'
                    ? `Your Knowledge Space has been successfully deployed and is ready to use.`
                    : 'Please wait while we set up your infrastructure. This typically takes 3-5 minutes.'}
                </p>
              </div>
            </div>

            {/* Provisioning Progress */}
            {provisioningStatus !== 'complete' && (
              <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-8 space-y-6 mb-8">
                <h2 className="text-xl font-semibold">Deployment Progress</h2>
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className="mt-1">
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : provisioningStatus === step.id ? (
                          <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border-2 border-white/20" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p
                          className={`text-sm ${
                            step.completed || provisioningStatus === step.id
                              ? 'text-white'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instance Details */}
            {provisioningStatus === 'complete' && (
              <>
                <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-8 space-y-6 mb-8">
                  <h2 className="text-xl font-semibold">Instance Details</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <ExternalLink className="h-5 w-5 text-emerald-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-400 mb-1">Your Knowledge Space URL</p>
                        <a
                          href={instanceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-400 hover:text-emerald-300 break-all font-mono text-sm underline"
                        >
                          {instanceUrl}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-emerald-400 mt-1" />
                      <div className="flex-1">
                        <p className="text-sm text-slate-400 mb-1">Verification Email</p>
                        <p className="text-sm text-white">
                          We&apos;ve sent verification instructions to your admin email. Please check your
                          inbox.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-6 mb-8">
                  <h3 className="text-lg font-semibold mb-4">Next Steps</h3>
                  <ol className="space-y-3 text-sm text-slate-300">
                    <li className="flex gap-3">
                      <span className="font-semibold text-emerald-400">1.</span>
                      <span>
                        Check your email and click the verification link to activate your admin
                        account
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-emerald-400">2.</span>
                      <span>Log in to your Knowledge Space using your admin credentials</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-emerald-400">3.</span>
                      <span>
                        Complete the setup wizard to configure AI providers and invite team members
                      </span>
                    </li>
                    <li className="flex gap-3">
                      <span className="font-semibold text-emerald-400">4.</span>
                      <span>Start creating and organizing your knowledge with notebooks</span>
                    </li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href={instanceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-[#0b1220] font-semibold hover:opacity-90 transition-all shadow-lg shadow-emerald-400/20"
                  >
                    <ExternalLink className="h-5 w-5" />
                    Open Your Knowledge Space
                  </a>
                  <Link
                    href="/space"
                    onClick={() => resetWizard()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all"
                  >
                    Back to Wundr Space
                  </Link>
                </div>

                {/* Support */}
                <div className="text-center mt-8">
                  <p className="text-sm text-slate-400">
                    Need help?{' '}
                    <a
                      href="mailto:support@wundr.space"
                      className="text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Contact our support team
                    </a>
                  </p>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
