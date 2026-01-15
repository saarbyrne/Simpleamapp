import { Users, BarChart3, FileText, Zap, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Player Management",
    description: "Add your squad. Track performance. Done."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "AI-powered insights that reduce admin time."
  },
  {
    icon: FileText,
    title: "Smart Reports",
    description: "Generate reports in seconds, not hours."
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Click. Add. Done. No waiting around."
  },
  {
    icon: Shield,
    title: "Secure & Compliant",
    description: "GDPR compliant with enterprise-grade security."
  },
  {
    icon: Clock,
    title: "Always Available",
    description: "Reliable tools that always turn up."
  }
];

export function Features() {
  return (
    <section className="bg-muted py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Does exactly what it says on the app.
          </h2>
          <p className="text-xl text-foreground/70">
            Everything you need to manage your team. Nothing you don&apos;t.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-foreground/70">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
