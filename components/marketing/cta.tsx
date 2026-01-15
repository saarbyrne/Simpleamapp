import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/marketing/get-started-button";
import Link from "next/link";

export function CTA() {
  return (
    <section className="bg-foreground py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-6">
          Ready to simplify your athlete management?
        </h2>
        <p className="text-xl text-white/70 mb-8">
          Join thousands of coaches who trust SAM to handle the details.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <GetStartedButton
            className="bg-primary hover:bg-primary/90 text-white px-8 rounded-md"
          >
            START FREE TRIAL
          </GetStartedButton>
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
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </div>
    </section>
  );
}
