"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { AuthAwareLink } from "@/components/marketing/auth-aware-link";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-[#1E1E1E]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-2xl font-extrabold text-[#142978]">
              simpleam
            </span>
            <span className="ml-1 w-2 h-2 bg-[#142978] rounded-full"></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/features"
              className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
            >
              Features
            </Link>
            <a
              href="#pricing"
              className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
            >
              Pricing
            </a>
            <Link
              href="/about"
              className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" className="text-[#1E1E1E] hover:text-[#142978]" asChild>
              <AuthAwareLink>Log In</AuthAwareLink>
            </Button>
            <Button className="bg-[#142978] hover:bg-[#142978]/90 text-white rounded-md" asChild>
              <AuthAwareLink>GET STARTED</AuthAwareLink>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#1E1E1E]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#1E1E1E]/10">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/features"
                className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <a
                href="#pricing"
                className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <Link
                href="/about"
                className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-[#1E1E1E] hover:text-[#142978] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Button variant="ghost" className="text-[#1E1E1E] hover:text-[#142978]" asChild>
                  <AuthAwareLink>Log In</AuthAwareLink>
                </Button>
                <Button className="bg-[#142978] hover:bg-[#142978]/90 text-white rounded-md" asChild>
                  <AuthAwareLink>GET STARTED</AuthAwareLink>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
