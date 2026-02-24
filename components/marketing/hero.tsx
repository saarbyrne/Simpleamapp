import { Button } from "@/components/ui/button";
import { GetStartedButton } from "@/components/marketing/get-started-button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-block px-4 py-2 bg-muted rounded-full">
              <p className="text-foreground text-sm">Simple Athlete Management</p>
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
              Simple tools.<br />
              Serious results.
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Professional-grade athlete management tools that just work. No complexity. No hidden costs. No drama.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <GetStartedButton
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-md"
              />
              <Button
                size="lg"
                variant="outline"
                className="border-foreground text-foreground hover:bg-muted rounded-md"
                asChild
              >
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <p className="text-primary">No setup fees</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <p className="text-primary">Cancel anytime</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <p className="text-primary">GDPR compliant</p>
              </div>
            </div>
          </div>

          {/* Right Content - Product Preview */}
          <div className="relative">
            <div className="relative bg-muted rounded-lg p-8 shadow-2xl">
              <div className="absolute -top-4 -start-4 w-24 h-24 bg-primary rounded-lg opacity-20"></div>
              <div className="absolute -bottom-4 -end-4 w-32 h-32 bg-primary rounded-lg opacity-10"></div>
              <Image
                src="https://images.unsplash.com/photo-1743004873139-5bc0e3d937d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjB0ZWFtJTIwdGFibGV0JTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MjI4NjY0M3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="SAM Platform Dashboard"
                width={1080}
                height={720}
                priority={true}
                className="relative rounded-lg w-full object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
