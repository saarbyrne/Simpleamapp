import { Check } from "lucide-react";
import { PricingButton } from "@/components/marketing/pricing-button";

export function Pricing() {
  const plans = [
    {
      name: "Free",
      price: "€0",
      period: "",
      description: "Core tools to get started",
      features: [
        "Players",
        "Notes",
        "Calendar",
        "Basic Reports",
        "Files",
        "Templates Hub"
      ],
      cta: "Sign Up Free",
      popular: false
    },
    {
      name: "Pro",
      price: "€25",
      period: "/user/month",
      description: "Full toolkit for serious teams",
      features: [
        "Everything in Free",
        "Forms",
        "Full Reports",
        "Spreadsheets",
        "Canvas",
        "Planner",
        "Data Management",
        "API access",
        "Integrations"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "AI",
      price: "€49",
      period: "/user/month",
      description: "Pro tools + AI intelligence",
      features: [
        "Everything in Pro",
        "AI analysis",
        "AI-powered insights",
        "Smart summaries",
        "Predictive analytics",
        "Automated reporting"
      ],
      cta: "Start Free Trial",
      popular: false
    }
  ];

  return (
    <section id="pricing" className="bg-muted py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-foreground mb-6">
            Straightforward pricing.
          </h2>
          <p className="text-xl text-muted-foreground">
            No hidden fees. No surprise charges. No extra tiers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-background rounded-lg p-8 ${
                plan.popular
                  ? 'ring-2 ring-primary shadow-xl relative'
                  : 'shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 start-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-foreground mb-2">
                  {plan.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-muted-foreground ms-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <PricingButton
                className={`w-full mb-6 rounded-md ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                    : 'bg-foreground hover:bg-foreground/90 text-background'
                }`}
                popular={plan.popular}
              >
                {plan.cta}
              </PricingButton>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-muted-foreground">
            Paid plans include 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-muted-foreground">
            Volume discounts available for clubs with 10+ users.
          </p>
        </div>
      </div>
    </section>
  );
}
