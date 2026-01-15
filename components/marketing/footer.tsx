import Link from "next/link";

export function Footer() {
  const footerLinks = {
    Product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "#pricing" },
      { name: "API", href: "#api" },
      { name: "Integrations", href: "#integrations" }
    ],
    Company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "/contact" }
    ],
    Resources: [
      { name: "Documentation", href: "#documentation" },
      { name: "Help Center", href: "#help" },
      { name: "Community", href: "#community" },
      { name: "Status", href: "#status" }
    ],
    Legal: [
      { name: "Privacy", href: "#privacy" },
      { name: "Terms", href: "#terms" },
      { name: "Security", href: "#security" },
      { name: "GDPR", href: "#gdpr" }
    ]
  };

  return (
    <footer className="bg-marketing-brand-dark text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="text-2xl font-extrabold text-marketing-brand-primary">
                simpleam
              </span>
              <span className="ml-1 w-2 h-2 bg-marketing-brand-primary rounded-full"></span>
            </Link>
            <p className="text-white/70 text-sm">
              Simple tools. Serious results.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">
                {category}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    {link.href.startsWith('#') ? (
                      <a
                        href={link.href}
                        className="text-white/70 hover:text-marketing-brand-primary transition-colors text-sm"
                      >
                        {link.name}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-marketing-brand-primary transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © 2025 SAM. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#twitter" className="text-white/70 hover:text-marketing-brand-primary transition-colors text-sm">
              Twitter
            </a>
            <a href="#linkedin" className="text-white/70 hover:text-marketing-brand-primary transition-colors text-sm">
              LinkedIn
            </a>
            <a href="#discord" className="text-white/70 hover:text-marketing-brand-primary transition-colors text-sm">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
