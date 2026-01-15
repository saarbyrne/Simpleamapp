export function Testimonials() {
  const testimonials = [
    {
      quote: "We don't call it innovation. We just built it. And it works.",
      author: "Sarah Mitchell",
      role: "Head Coach, Manchester United Academy"
    },
    {
      quote: "SAM sorts it. No fuss, no drama, just proper tools.",
      author: "James Rodriguez",
      role: "Performance Director, FC Barcelona"
    },
    {
      quote: "Saved us hours every week. The AI summary is brilliant.",
      author: "Emma Thompson",
      role: "Club Manager, Liverpool FC"
    }
  ];

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-marketing-brand-dark mb-6">
            What coaches say.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-marketing-brand-light p-8 rounded-lg"
            >
              <p className="text-lg text-marketing-brand-dark mb-6 italic">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <p className="text-marketing-brand-dark font-semibold">
                  {testimonial.author}
                </p>
                <p className="text-marketing-brand-dark/70 text-sm">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
