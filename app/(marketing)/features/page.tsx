import {
  Users,
  FileText,
  BarChart3,
  Calendar,
  StickyNote,
  Table,
  Palette,
  FolderOpen,
  ClipboardList,
  Database,
  Settings,
  UserCircle,
  Sparkles,
  LayoutTemplate,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    icon: Users,
    title: "Players",
    description: "Add your squad. Track performance. Done. Manage athlete profiles, stats, and progress all in one place."
  },
  {
    icon: FileText,
    title: "Forms",
    description: "Build custom forms in minutes. Collect data without the hassle. No coding required."
  },
  {
    icon: BarChart3,
    title: "Reports",
    description: "Generate professional reports in seconds. AI-powered insights that actually matter."
  },
  {
    icon: Calendar,
    title: "Calendar",
    description: "Schedule training, matches, and events. Keep everyone on the same page, literally."
  },
  {
    icon: StickyNote,
    title: "Notes",
    description: "Capture observations, feedback, and ideas. Quick notes that stick around when you need them."
  },
  {
    icon: Table,
    title: "Spreadsheets",
    description: "Simple data tables that just work. No Excel degree needed."
  },
  {
    icon: Palette,
    title: "Canvas",
    description: "Sketch tactics, diagram plays, visualize strategies. Drawing tools for coaches who think visually."
  },
  {
    icon: FolderOpen,
    title: "Files",
    description: "Store training plans, medical records, and documents. Everything in one secure place."
  },
  {
    icon: ClipboardList,
    title: "Planner",
    description: "Plan your season, week, or day. Simple planning tools that keep you organized."
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Import, export, and manage your data. Your information, your control."
  },
  {
    icon: Settings,
    title: "System Settings",
    description: "Customize SAM to fit your workflow. Set it up once, forget about it."
  },
  {
    icon: UserCircle,
    title: "User Profile",
    description: "Manage your account, preferences, and team access. Simple profile management."
  },
  {
    icon: Sparkles,
    title: "AI",
    description: "Smart automation that saves you hours. AI that works for you, not against you."
  },
  {
    icon: LayoutTemplate,
    title: "Templates Hub",
    description: "Pre-built templates to get started fast. No need to reinvent the wheel."
  }
];

export default function FeaturesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-white pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block px-4 py-2 bg-[#F5F5F5] rounded-full mb-6">
              <p className="text-[#1E1E1E] text-sm">Everything You Need</p>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-[#1E1E1E] mb-6">
              Every tool. Zero complexity.
            </h1>

            <p className="text-xl text-[#1E1E1E]/70 max-w-2xl mx-auto mb-8">
              SAM gives you professional-grade athlete management tools without the learning curve. Simple features that deliver serious results.
            </p>

            <Button
              size="lg"
              className="bg-[#142978] hover:bg-[#142978]/90 text-white px-8 rounded-md"
              asChild
            >
              <Link href="/login">
                START FREE TRIAL
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#F5F5F5] py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 bg-[#142978]/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#142978] transition-colors">
                    <Icon className="w-7 h-7 text-[#142978] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-extrabold text-[#1E1E1E] mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[#1E1E1E]/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#142978] py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
            All features. One simple price.
          </h2>
          <p className="text-xl text-white/70 mb-8">
            No feature tiers. No hidden tools. Everything you see here is included in every plan.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white hover:bg-white/90 text-[#142978] px-8 rounded-md"
              asChild
            >
              <a href="/#pricing">
                VIEW PRICING
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 rounded-md"
              asChild
            >
              <Link href="/contact">
                Schedule Demo
              </Link>
            </Button>
          </div>
          <p className="text-white/50 mt-6 text-sm">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
