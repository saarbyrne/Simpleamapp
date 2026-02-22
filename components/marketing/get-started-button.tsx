import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface GetStartedButtonProps {
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
  children?: React.ReactNode;
  showArrow?: boolean;
}

export async function GetStartedButton({
  variant = "default",
  size = "lg",
  className = "",
  children = "GET STARTED",
  showArrow = true
}: GetStartedButtonProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // If user is authenticated, send them to dashboard
  const href = user ? "/dashboard" : "/login";

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      asChild
    >
      <Link href={href}>
        {children}
        {showArrow && <ArrowRight className="ms-2 h-5 w-5" />}
      </Link>
    </Button>
  );
}
