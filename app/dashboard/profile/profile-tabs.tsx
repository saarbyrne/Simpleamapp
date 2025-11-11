"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./tabs/profile-tab";
import { PreferencesTab } from "./tabs/preferences-tab";
import { NotificationsTab } from "./tabs/notifications-tab";
import { SecurityTab } from "./tabs/security-tab";
import { useTranslations } from "next-intl";

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
  language: string | null;
  timezone: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  notificationSettings: any;
  organization: {
    id: string;
    name: string;
    slug: string;
    logo: string | null;
  };
  roles: Array<{
    name: string;
    permissions: string[];
  }>;
}

interface ProfileTabsProps {
  user: User;
}

export function ProfileTabs({ user }: ProfileTabsProps) {
  const t = useTranslations('profile');
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList>
        <TabsTrigger value="profile">{t('profileTab')}</TabsTrigger>
        <TabsTrigger value="preferences">{t('preferencesTab')}</TabsTrigger>
        <TabsTrigger value="notifications">{t('notificationsTab')}</TabsTrigger>
        <TabsTrigger value="security">{t('securityTab')}</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="mt-6">
        <ProfileTab user={user} />
      </TabsContent>

      <TabsContent value="preferences" className="mt-6">
        <PreferencesTab user={user} />
      </TabsContent>

      <TabsContent value="notifications" className="mt-6">
        <NotificationsTab user={user} />
      </TabsContent>

      <TabsContent value="security" className="mt-6">
        <SecurityTab user={user} />
      </TabsContent>
    </Tabs>
  );
}
