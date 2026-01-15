import Image from "next/image";

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Sign up",
      description: "Create your account in under 60 seconds."
    },
    {
      number: "02",
      title: "Add your squad",
      description: "Import or add players manually."
    },
    {
      number: "03",
      title: "Start managing",
      description: "Track, analyze, and improve performance."
    }
  ];

  return (
    <section id="how-it-works" className="bg-primary py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Image */}
          <div className="order-2 lg:order-1">
            <Image
              src="https://images.unsplash.com/photo-1596443019365-eb263a588404?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwd29ya3NwYWNlJTIwbGFwdG9wfGVufDF8fHx8MTc2MjI4NjY0NHww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Simple workflow"
              width={1080}
              height={720}
              loading="lazy"
              className="rounded-lg shadow-2xl w-full"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Right - Steps */}
          <div className="order-1 lg:order-2 space-y-12">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-4">
                Built for real teams.
              </h2>
              <p className="text-xl text-white/70">
                From grassroots to elite. SAM keeps it simple.
              </p>
            </div>

            <div className="space-y-8">
              {steps.map((step) => (
                <div key={step.number} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
                      <span className="text-white text-xl font-bold">{step.number}</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-extrabold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-white/70">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
