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
    <section id="pricing" className="bg-marketing-brand-light py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-marketing-brand-dark mb-6">
            Straightforward pricing.
          </h2>
          <p className="text-xl text-marketing-brand-dark/70">
            No hidden fees. No surprise charges. No extra tiers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg p-8 ${
                plan.popular
                  ? 'ring-2 ring-[MARKETING_BRAND_PRIMARY] shadow-xl relative'
                  : 'shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-marketing-brand-primary text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-extrabold text-marketing-brand-dark mb-2">
                  {plan.name}
                </h3>
                <p className="text-marketing-brand-dark/70 text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-extrabold text-marketing-brand-dark">
                    {plan.price}
                  </span>
                  <span className="text-marketing-brand-dark/70 ml-2">
                    {plan.period}
                  </span>
                </div>
              </div>

              <PricingButton
                className={`w-full mb-6 rounded-md ${
                  plan.popular
                    ? 'bg-marketing-brand-primary hover:bg-marketing-brand-primary/90 text-white'
                    : 'bg-marketing-brand-dark hover:bg-marketing-brand-dark/90 text-white'
                }`}
                popular={plan.popular}
              >
                {plan.cta}
              </PricingButton>

              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-marketing-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-marketing-brand-dark/70">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12 space-y-2">
          <p className="text-marketing-brand-dark/70">
            Paid plans include 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-marketing-brand-dark/60">
            Volume discounts available for clubs with 10+ users.
          </p>
        </div>
      </div>
    </section>
  );
}
