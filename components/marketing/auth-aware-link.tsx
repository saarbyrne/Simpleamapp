"use client";

import { useEffect, useState, forwardRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface AuthAwareLinkProps {
  children: React.ReactNode;
  className?: string;
  loginHref?: string;
  dashboardHref?: string;
}

/**
 * A link component that intelligently routes based on authentication status:
 * - If user is logged in → routes to dashboard
 * - If user is not logged in → routes to login page
 */
export const AuthAwareLink = forwardRef<HTMLAnchorElement, AuthAwareLinkProps>(
  function AuthAwareLink(
    {
      children,
      className,
      loginHref = "/login",
      dashboardHref = "/dashboard"
    },
    ref
  ) {
    const [href, setHref] = useState(loginHref);

    useEffect(() => {
      async function checkAuth() {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          setHref(user ? dashboardHref : loginHref);
        } catch (error) {
          // On error, default to login
          setHref(loginHref);
        }
      }

      checkAuth();
    }, [loginHref, dashboardHref]);

    // Always return a Link element so it works with Button's asChild prop
    return (
      <Link href={href} className={className} ref={ref}>
        {children}
      </Link>
    );
  }
);
