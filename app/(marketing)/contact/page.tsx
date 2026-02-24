"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission would be handled here
    console.log("Form submitted:", formData);
    // TODO: Implement actual form submission
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-background pt-24 pb-16 lg:pt-32 lg:pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-6">
            <span className="text-primary font-extrabold">CONTACT</span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-foreground mb-8">
            Get in touch.
          </h1>

          <p className="text-xl text-muted-foreground">
            Questions about SAM? Want to see a demo? Just drop us a message. We&apos;ll get back to you quickly.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-muted py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-2">
                  Email us
                </h3>
                <p className="text-muted-foreground mb-2">
                  Quick questions or detailed inquiries.
                </p>
                <a
                  href="mailto:hello@simpleam.com"
                  className="text-primary hover:underline"
                >
                  hello@simpleam.com
                </a>
              </div>

              <div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-extrabold text-foreground mb-2">
                  Schedule a demo
                </h3>
                <p className="text-muted-foreground">
                  See SAM in action. 15-minute walkthrough, no sales pitch.
                </p>
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Response time: Usually within 24 hours
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-background p-8 rounded-lg shadow-lg">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground mb-2 block">
                      Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-foreground mb-2 block">
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-foreground mb-2 block">
                      Subject
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-foreground mb-2 block">
                      Message
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full min-h-[150px]"
                      placeholder="Tell us what you need..."
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-md"
                  >
                    SEND MESSAGE
                    <Send className="ms-2 h-5 w-5" />
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We respect your privacy. No spam, ever.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Quick CTA */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-foreground mb-6">
            Or just start for free.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            No demo needed. Sign up and start managing your team in minutes.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 rounded-md"
            asChild
          >
            <a href="/login">START FREE</a>
          </Button>
        </div>
      </section>
    </>
  );
}
