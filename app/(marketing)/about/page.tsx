import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Zap, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

const principles = [
  {
    title: "Build it once. Use it everywhere.",
    description: "Modular tools that work across your entire operation. No rebuilding the same thing twice."
  },
  {
    title: "Call it the thing, not the action.",
    description: "Folders, not projects. Spreadsheets, not workloads. We sell functionality. You decide how to use it."
  },
  {
    title: "Keep it simple.",
    description: "Clean interface. Straightforward workflows. No unnecessary complexity."
  },
  {
    title: "Sport-agnostic by design.",
    description: "Define your own positions, formations, and metrics. We provide the tools, you define the rules."
  },
  {
    title: "Buy over build, build over buy.",
    description: "Whatever's most cost-effective. We're obsessed with reducing costs without cutting corners."
  }
];

const pillars = [
  {
    icon: Zap,
    title: "Simplicity",
    description: "Intuitive workflows. Minimal steps. Modular components that just work."
  },
  {
    icon: TrendingUp,
    title: "Affordability",
    description: "Transparent pricing. No hidden costs. Professional tools at grassroots prices."
  },
  {
    icon: Shield,
    title: "Trust",
    description: "GDPR compliant. Secure by default. Your data stays yours."
  },
  {
    icon: Target,
    title: "Performance",
    description: "Fast AI-enhanced insights. Less admin time. More coaching time."
  },
  {
    icon: Users,
    title: "Community",
    description: "Built with feedback from real coaches and clubs. Always listening."
  }
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-accent-foreground font-extrabold">ABOUT SAM</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground mb-8">
            Redefining athlete management.
          </h1>

          <p className="text-xl text-foreground/70 mb-6">
            Professional-grade tools shouldn&apos;t cost professional-grade money. SAM makes high-quality athlete management software affordable, simple, and powered by AI.
          </p>

          <p className="text-xl text-foreground/70">
            Every coach and club — from grassroots to elite — should have access to performance tools that just work.
          </p>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-muted py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-foreground mb-8">
            The problem with sports software.
          </h2>

          <div className="space-y-6 text-lg text-foreground/70">
            <p>
              Current athlete management systems were built on legacy architectures. They&apos;re expensive, complex, and slow to adapt to new technology.
            </p>

            <p>
              Large organizations with ingrained processes take years to integrate AI. Meanwhile, contracts lock clubs into 2-3 year commitments with inflated costs and bloated feature sets.
            </p>

            <p>
              The market is ripe for disruption. Not through flashy innovation marketing, but through honest execution: high-quality tools at low cost, built by a lean team using modern AI.
            </p>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-foreground mb-12">
            How we build SAM.
          </h2>

          <div className="space-y-8">
            {principles.map((principle, index) => (
              <div key={index} className="border-l-4 border-primary pl-6">
                <h3 className="text-xl font-extrabold text-foreground mb-2">
                  {principle.title}
                </h3>
                <p className="text-foreground/70">
                  {principle.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategic Pillars */}
      <section className="bg-muted py-24 lg:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-foreground mb-12 text-center">
            What drives us.
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-lg">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-extrabold text-foreground mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-foreground/70">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-foreground mb-8">
            Built by people who understand sports and software.
          </h2>

          <div className="space-y-6 text-lg text-foreground/70">
            <p>
              SAM was founded by <a href="https://linkedin.com/in/saar-byrne-72516b20" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Saar Byrne</a>, who brings a first-principles approach to solving major problems through ambitious goals and superior products.
            </p>

            <p>
              The philosophy is simple: understand what users need, understand what technology can do, then ruthlessly cut costs while maintaining quality. Automate everything that&apos;s sensible to automate. Stay lean. Move fast. Build tools that work.
            </p>

            <p>
              We&apos;re not here to add complexity. We&apos;re here to remove it.
            </p>
          </div>
        </div>
      </section>

      {/* Brand Promise */}
      <section className="bg-primary py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
            Our promise.
          </h2>
          <p className="text-xl text-white/80 mb-12">
            A simple, powerful, low-cost platform for managing players, data, and performance — without the complexity or price tag of legacy systems.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-primary px-8 rounded-md"
              asChild
            >
              <Link href="/features">
                SEE FEATURES
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-md"
              asChild
            >
              <Link href="/login">
                START FREE
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
