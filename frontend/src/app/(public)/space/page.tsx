import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Shield,
  Zap,
  Lock,
  Users,
  Brain,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Network,
  Target,
  Database,
  Cpu
} from 'lucide-react'

export default function LandingPage() {
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
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/space#features" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="/space#how-it-works" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="/space#services" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="/notebooks" className="text-sm font-medium text-emerald-300 hover:text-emerald-400 transition-colors">
                Sign In →
              </Link>
            </nav>
          </div>
        </header>

        <main>
          {/* Hero Section */}
          <section className="container mx-auto max-w-7xl px-6 py-16 md:py-24">
            <div className="flex flex-col items-center text-center space-y-8">
              <a
                href="https://github.com/lfnovo/open-notebook"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-300/10 px-3 py-1 text-xs uppercase tracking-wider text-emerald-300 hover:border-emerald-300 hover:bg-emerald-300/20 transition-all cursor-pointer"
              >
                <Sparkles className="h-3 w-3" />
                <span>Powered by Open Notebook</span>
              </a>

              <h1 className="max-w-4xl text-4xl md:text-5xl font-semibold tracking-tight leading-relaxed">
                Knowledge Ops for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> Privacy-First</span> Teams
              </h1>

              <p className="max-w-2xl text-lg md:text-xl text-slate-300 leading-relaxed">
                Your own private AI-powered research platform. Complete control, zero compromise on privacy.
                Deploy your Knowledge Space in minutes and start transforming how your organization manages knowledge.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Link href="/space/onboard">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-[#0b1220] font-semibold hover:opacity-90 transition-all shadow-lg shadow-emerald-400/10">
                    Create Your Knowledge Space
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <Link href="/space#how-it-works">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all">
                    Learn More
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 w-full max-w-3xl">
                {[
                  { value: '100%', label: 'Private & Secure' },
                  { value: '16+', label: 'AI Providers' },
                  { value: '5min', label: 'Setup Time' },
                  { value: '∞', label: 'Customization' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-400">
                      {stat.value}
                    </div>
                    <div className="text-sm text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Value Propositions */}
          <section className="container mx-auto max-w-7xl px-6 py-16">
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Lock,
                  title: 'Privacy by Design',
                  description: 'Your data never leaves your infrastructure. With Ollama as default, your AI runs completely locally. No external dependencies, no data leaks, complete sovereignty.'
                },
                {
                  icon: Shield,
                  title: 'Complete Control',
                  description: 'Your own isolated instance on Google Cloud. Full administrative access, custom configurations, and the flexibility to adapt as your needs evolve.'
                },
                {
                  icon: Zap,
                  title: 'Ready in Minutes',
                  description: 'Automated deployment on Google Cloud infrastructure. Just configure your preferences and we&apos;ll handle the rest. Start using your Knowledge Space immediately.'
                }
              ].map((feature, i) => (
                <div key={i} className="group relative rounded-2xl border border-white/10 bg-[#0e1526] p-8 hover:border-emerald-300/50 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.4)] transition-all">
                  <div className="absolute -top-6 -left-6 h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400/70 to-teal-400/70 flex items-center justify-center opacity-[0.06]" />
                  <div className="relative">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-300/10 text-emerald-300 mb-4">
                      <feature.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="container mx-auto max-w-7xl px-6 py-16">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Enterprise Knowledge Ops Platform
              </h2>
              <p className="text-lg text-slate-400">
                Built on Open Notebook, the privacy-first alternative to Google&apos;s Notebook LM
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Brain,
                  title: 'AI-Powered Research',
                  description: 'Chat with your documents, generate insights, and extract knowledge using state-of-the-art AI models.'
                },
                {
                  icon: Users,
                  title: 'Team Collaboration',
                  description: 'Share notebooks, collaborate on research, and build collective knowledge across your organization.'
                },
                {
                  icon: Database,
                  title: 'Multi-Modal Sources',
                  description: 'PDFs, videos, audio, web pages, Office docs - all processed and searchable in one place.'
                },
                {
                  icon: Network,
                  title: 'Professional Podcasts',
                  description: 'Generate multi-speaker podcasts from your content with customizable voices and personalities.'
                },
                {
                  icon: Sparkles,
                  title: 'Content Transformations',
                  description: 'Custom AI workflows to summarize, analyze, and extract insights from your content automatically.'
                },
                {
                  icon: Target,
                  title: 'Semantic Search',
                  description: 'Vector and full-text search across all your content. Find what you need, when you need it.'
                }
              ].map((feature, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/[0.07] transition-all">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400/70 to-teal-400/70 text-white mb-4">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="container mx-auto max-w-7xl px-6 py-16">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg text-slate-400">
                From signup to your first AI-powered insight in less than 5 minutes
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  step: '01',
                  title: 'Configure Your Space',
                  description: 'Tell us about your organization and choose your instance settings. Pick your subdomain and configure your preferences.'
                },
                {
                  step: '02',
                  title: 'Automated Deployment',
                  description: 'We automatically provision your private instance on Google Cloud with Ollama pre-configured for complete privacy.'
                },
                {
                  step: '03',
                  title: 'Start Building Knowledge',
                  description: 'Upload your first documents, create notebooks, and start chatting with your content using AI.'
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="rounded-2xl border border-white/10 bg-[#0e1526] p-8 space-y-4">
                    <div className="text-5xl font-semibold text-emerald-300/20">{item.step}</div>
                    <h3 className="text-xl font-semibold">{item.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Professional Services */}
          <section id="services" className="container mx-auto max-w-7xl px-6 py-16">
            <div className="text-center mb-12 space-y-3">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Expert Support When You Need It
              </h2>
              <p className="text-lg text-slate-400">
                Accelerate your Knowledge Ops journey with professional services from the Wundr team
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              {[
                {
                  icon: Network,
                  title: 'Wundr Map',
                  description: 'Strategic consulting and knowledge architecture. We help you design and implement Knowledge Ops that transform how your organization thinks and works.',
                  link: 'https://map.wundr.space'
                },
                {
                  icon: Cpu,
                  title: 'Wundr AI Lab',
                  description: 'Custom AI solutions and agentic automation. Our experts build tailored AI workflows that integrate seamlessly with your Knowledge Space.',
                  link: 'https://lab.wundr.space'
                }
              ].map((service, i) => (
                <div key={i} className="group rounded-2xl border border-white/10 bg-[#0e1526] p-8 hover:border-emerald-300/50 hover:shadow-[0_0_0_1px_rgba(16,185,129,0.4)] transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-400">
                      <service.icon className="h-6 w-6 text-[#0b1220]" />
                    </div>
                    <h3 className="text-2xl font-semibold">{service.title}</h3>
                  </div>
                  <p className="text-slate-400 leading-relaxed mb-6">{service.description}</p>
                  <a
                    href={service.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-400 font-medium transition-colors"
                  >
                    Explore {service.title.split(' ')[1]}
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto max-w-7xl px-6 py-16">
            <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-12 text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Ready to Transform Your Knowledge Operations?
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                Join forward-thinking organizations who trust Wundr Space for their most sensitive research and knowledge work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/space/onboard">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-400 text-[#0b1220] font-semibold hover:opacity-90 transition-all shadow-lg shadow-emerald-400/10">
                    Create Your Knowledge Space
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
                <a href="mailto:contact@wundr.space">
                  <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 text-white font-medium hover:bg-white/10 transition-all">
                    Contact Sales
                  </button>
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-slate-400">
                {['No credit card required', '5-minute setup', 'Cancel anytime'].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-[#0b1220]/70 backdrop-blur">
          <div className="container mx-auto max-w-7xl px-6 py-12">
            <div className="grid gap-8 md:grid-cols-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-400 p-1">
                    <Brain className="h-5 w-5 text-[#0b1220]" />
                  </div>
                  <span className="font-semibold">Wundr Space</span>
                </div>
                <p className="text-sm text-slate-400">
                  Privacy-first Knowledge Ops platform powered by Open Notebook.
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Product</h4>
                <div className="flex flex-col gap-2">
                  <Link href="/space#features" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Features
                  </Link>
                  <Link href="/space#how-it-works" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    How It Works
                  </Link>
                  <Link href="/space#services" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Services
                  </Link>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Services</h4>
                <div className="flex flex-col gap-2">
                  <a href="https://map.wundr.space" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Wundr Map
                  </a>
                  <a href="https://lab.wundr.space" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Wundr AI Lab
                  </a>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Resources</h4>
                <div className="flex flex-col gap-2">
                  <a href="https://www.open-notebook.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Open Notebook
                  </a>
                  <a href="https://github.com/lfnovo/open-notebook" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    GitHub
                  </a>
                  <a href="https://discord.gg/37XJPXfz2w" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-emerald-300 transition-colors">
                    Discord
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
              <p>© 2024 Wundr Space. Built with Open Notebook. MIT Licensed.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
