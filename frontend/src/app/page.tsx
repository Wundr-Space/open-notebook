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
  Target
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Wundr Space</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link href="#services" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </Link>
            <Link href="/notebooks" className="text-sm font-medium hover:text-primary transition-colors">
              Sign In
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="container flex flex-col items-center gap-8 pt-20 pb-16 md:pt-28 md:pb-24">
          <div className="flex flex-col items-center gap-4 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm">
              <Sparkles className="h-4 w-4" />
              <span>Powered by Open Notebook</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Knowledge Ops for
              <span className="text-primary"> Privacy-First</span> Teams
            </h1>
            <p className="text-lg text-muted-foreground sm:text-xl max-w-2xl">
              Your own private AI-powered research platform. Complete control, zero compromise on privacy.
              Deploy your Knowledge Space in minutes and start transforming how your organization manages knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button size="lg" className="text-lg px-8" asChild>
                <Link href="#onboarding">
                  Create Your Knowledge Space
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link href="#how-it-works">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 w-full max-w-3xl">
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">100%</div>
              <div className="text-sm text-muted-foreground text-center">Private & Secure</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">16+</div>
              <div className="text-sm text-muted-foreground text-center">AI Providers</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">5min</div>
              <div className="text-sm text-muted-foreground text-center">Setup Time</div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="text-3xl font-bold text-primary">∞</div>
              <div className="text-sm text-muted-foreground text-center">Customization</div>
            </div>
          </div>
        </section>

        {/* Value Propositions */}
        <section className="border-t bg-muted/50">
          <div className="container py-16 md:py-24">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Privacy by Design</h3>
                <p className="text-muted-foreground">
                  Your data never leaves your infrastructure. With Ollama as default, your AI runs completely
                  locally. No external dependencies, no data leaks, complete sovereignty.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Complete Control</h3>
                <p className="text-muted-foreground">
                  Your own isolated instance on Google Cloud. Full administrative access, custom configurations,
                  and the flexibility to adapt as your needs evolve.
                </p>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Ready in Minutes</h3>
                <p className="text-muted-foreground">
                  Automated deployment on Google Cloud infrastructure. Just configure your preferences and
                  we&apos;ll handle the rest. Start using your Knowledge Space immediately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Enterprise Knowledge Ops Platform
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
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
                icon: Lock,
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
            ].map((feature, index) => (
              <div key={index} className="flex flex-col gap-3 rounded-lg border p-6 hover:shadow-lg transition-shadow">
                <feature.icon className="h-8 w-8 text-primary" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-t bg-muted/50">
          <div className="container py-16 md:py-24">
            <div className="flex flex-col items-center gap-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
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
              ].map((item, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <div className="text-5xl font-bold text-primary/20">{item.step}</div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  {index < 2 && (
                    <ChevronRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-8 w-8 text-muted-foreground/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Professional Services */}
        <section id="services" className="container py-16 md:py-24">
          <div className="flex flex-col items-center gap-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Expert Support When You Need It
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Accelerate your Knowledge Ops journey with professional services from the Wundr team
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            <div className="flex flex-col gap-4 rounded-lg border p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Network className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Wundr Map</h3>
              </div>
              <p className="text-muted-foreground">
                Strategic consulting and knowledge architecture. We help you design and implement
                Knowledge Ops that transform how your organization thinks and works.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="https://map.wundr.space" target="_blank" rel="noopener noreferrer">
                  Explore Wundr Map
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border p-8 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold">Wundr AI Lab</h3>
              </div>
              <p className="text-muted-foreground">
                Custom AI solutions and agentic automation. Our experts build tailored AI workflows
                that integrate seamlessly with your Knowledge Space.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <a href="https://lab.wundr.space" target="_blank" rel="noopener noreferrer">
                  Explore AI Lab
                  <ChevronRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Onboarding Placeholder */}
        <section id="onboarding" className="border-t">
          <div className="container flex flex-col items-center gap-8 py-16 md:py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl">
              Coming Soon: Self-Service Provisioning
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              We&apos;re building the onboarding wizard to make it even easier to create your Knowledge Space.
              In the meantime, get in touch and we&apos;ll set you up manually.
            </p>
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="mailto:contact@wundr.space">
                Contact Us to Get Started
                <ChevronRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-primary text-primary-foreground">
          <div className="container flex flex-col items-center gap-8 py-16 md:py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl">
              Ready to Transform Your Knowledge Operations?
            </h2>
            <p className="text-lg opacity-90 max-w-2xl">
              Join forward-thinking organizations who trust Wundr Space for their most sensitive research and knowledge work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
                <Link href="#onboarding">
                  Create Your Knowledge Space
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent hover:bg-primary-foreground/10" asChild>
                <Link href="mailto:contact@wundr.space">
                  Contact Sales
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm opacity-75">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>5-minute setup</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-bold">Wundr Space</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Privacy-first Knowledge Ops platform powered by Open Notebook.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold">Product</h4>
              <Link href="#features" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link href="#services" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Services
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold">Services</h4>
              <a href="https://map.wundr.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Wundr Map
              </a>
              <a href="https://lab.wundr.space" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Wundr AI Lab
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-semibold">Resources</h4>
              <a href="https://www.open-notebook.ai" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Open Notebook
              </a>
              <a href="https://github.com/lfnovo/open-notebook" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </a>
              <a href="https://discord.gg/37XJPXfz2w" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Discord
              </a>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 Wundr Space. Built with Open Notebook. MIT Licensed.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
