import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { getCurrentUserProfile } from "@/app/actions/profile";
import { ProfileTabs } from "./profile-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations('profile');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function ProfilePage() {
  const t = await getTranslations('profile');
  const supabase = await createServerClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  // Log for debugging connection issues
  console.log('Profile page: User authenticated, fetching profile for:', authUser.id);

  const profileResult = await getCurrentUserProfile();

  if (!profileResult.success || !profileResult.data) {
    return (
      <div className="container mx-auto p-6">
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm font-medium text-destructive mb-2">
            {t('failedToLoadProfile')}
          </p>
          <p className="text-sm text-destructive/80">
            {profileResult.error || t('pleaseTryAgain')}
          </p>
          {profileResult.error?.includes("migrations") && (
            <p className="text-xs text-muted-foreground mt-2">
              {t('runMigrations')} <code className="px-1 py-0.5 bg-muted rounded">npm run db:migrate</code> or <code className="px-1 py-0.5 bg-muted rounded">npx prisma generate</code>
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('description')}
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
