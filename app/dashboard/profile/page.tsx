import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/app/actions/profile";
import { ProfileTabs } from "./profile-tabs";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: "Profile Settings",
  description: "Manage your profile, preferences, and notification settings",
};

export default async function ProfilePage() {
  const supabase = await createServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const profileResult = await getCurrentUserProfile();

  if (!profileResult.success || !profileResult.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Failed to load profile. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your personal information, preferences, and security settings
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileTabs user={profileResult.data} />
      </Suspense>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}
