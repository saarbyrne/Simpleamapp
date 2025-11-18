import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PricingButtonProps {
  className?: string;
  children: React.ReactNode;
  popular?: boolean;
}

export async function PricingButton({ className, children, popular = false }: PricingButtonProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, send them to dashboard
  const href = user ? "/dashboard" : "/login";

  return (
    <Button
      className={className}
      asChild
    >
      <Link href={href}>
        {children}
      </Link>
    </Button>
  );
}
