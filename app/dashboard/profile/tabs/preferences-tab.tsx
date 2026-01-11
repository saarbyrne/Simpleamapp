"use client";

import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { updatePreferences } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const preferencesFormSchema = z.object({
  language: z.string().optional(),
  timezone: z.string().optional(),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]).optional(),
  timeFormat: z.enum(["12", "24"]).optional(),
  theme: z.enum(["light", "dark", "system"]).optional(),
});

type PreferencesFormValues = z.infer<typeof preferencesFormSchema>;

interface User {
  language: string | null;
  timezone: string | null;
  dateFormat: string | null;
  timeFormat: string | null;
  theme: string | null;
}

interface PreferencesTabProps {
  user: User;
}

// Common timezones
const TIMEZONES = [
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "America/New_York", label: "Eastern Time (US & Canada)" },
  { value: "America/Chicago", label: "Central Time (US & Canada)" },
  { value: "America/Denver", label: "Mountain Time (US & Canada)" },
  { value: "America/Los_Angeles", label: "Pacific Time (US & Canada)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Madrid", label: "Madrid (CET)" },
  { value: "Europe/Rome", label: "Rome (CET)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Australia/Sydney", label: "Sydney (AEDT)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "it", label: "Italiano" },
  { value: "ja", label: "日本語" },
  { value: "ar", label: "العربية" },
];

export function PreferencesTab({ user }: PreferencesTabProps) {
  const t = useTranslations();

  const form = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      language: user.language || "en",
      timezone: user.timezone || "UTC",
      dateFormat: (user.dateFormat as any) || "DD/MM/YYYY",
      timeFormat: (user.timeFormat as any) || "24",
      theme: (user.theme as any) || "system",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: PreferencesFormValues, e?: React.BaseSyntheticEvent) {
    // Prevent default form submission behavior
    e?.preventDefault();
    
    // Convert empty strings to null for optional fields
    const preferencesData = {
      language: data.language || null,
      timezone: data.timezone || null,
      dateFormat: data.dateFormat || null,
      timeFormat: data.timeFormat || null,
      theme: data.theme || null,
    };

    // Store in localStorage immediately for instant UI update
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("user-preferences", JSON.stringify(preferencesData));
        // Dispatch custom event to notify other components
        window.dispatchEvent(new Event('preferencesUpdated'));
      } catch (error) {
        console.error("Failed to store preferences in localStorage:", error);
      }
    }

    const result = await updatePreferences(preferencesData);

    if (result.success) {
      toast.success(t('profile.preferencesUpdated'));
      // No need to refresh - UI already updated via localStorage and events
    } else {
      toast.error(result.error || t('profile.failedToUpdatePreferences'));
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profile.preferences')}</CardTitle>
        <CardDescription>
          {t('profile.preferencesDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Language */}
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.displayLanguage')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.selectLanguage')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('profile.languageDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Timezone */}
            <FormField
              control={form.control}
              name="timezone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.timezone')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.selectTimezone')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TIMEZONES.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {t(`profile.timezones.${tz.value.replace(/\//g, '_')}`) || tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('profile.timezoneDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Format */}
            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.dateFormat')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.selectDateFormat')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">
                        DD/MM/YYYY ({t('profile.dateFormatExample.ddmmyyyy')})
                      </SelectItem>
                      <SelectItem value="MM/DD/YYYY">
                        MM/DD/YYYY ({t('profile.dateFormatExample.mmddyyyy')})
                      </SelectItem>
                      <SelectItem value="YYYY-MM-DD">
                        YYYY-MM-DD ({t('profile.dateFormatExample.yyyymmdd')})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('profile.dateFormatDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Format */}
            <FormField
              control={form.control}
              name="timeFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.timeFormat')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.selectTimeFormat')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12">{t('profile.timeFormat12')}</SelectItem>
                      <SelectItem value="24">{t('profile.timeFormat24')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('profile.timeFormatDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Theme */}
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('profile.theme')}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('profile.selectTheme')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">{t('profile.themeLight')}</SelectItem>
                      <SelectItem value="dark">{t('profile.themeDark')}</SelectItem>
                      <SelectItem value="system">{t('profile.themeSystem')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {t('profile.themeDescription')}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="me-2 h-4 w-4 animate-spin" />
                  {t('common.saving')}
                </>
              ) : (
                t('profile.savePreferences')
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
