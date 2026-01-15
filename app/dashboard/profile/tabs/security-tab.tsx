"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { passwordStrengthColors } from "@/design-system/tokens/status-colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMemo } from "react";
import { Loader2, AlertTriangle, Shield, Info } from "lucide-react";
import { changePassword } from "@/app/actions/profile";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// Schema will be created inside component to access translations
type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

interface User {
  authProvider: string;
}

interface SecurityTabProps {
  user: User;
}

export function SecurityTab({ user }: SecurityTabProps) {
  const router = useRouter();
  const t = useTranslations();
  const isOAuthUser = user.authProvider !== "email";

  // Create schema with translations
  const passwordFormSchema = useMemo(() => z
    .object({
      currentPassword: z.string().min(1, t('profile.security.currentPasswordRequired')),
      newPassword: z.string().min(8, t('profile.security.passwordMinLength')),
      confirmPassword: z.string().min(1, t('profile.security.confirmPasswordRequired')),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('profile.security.passwordsDontMatch'),
      path: ["confirmPassword"],
    }), [t]);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: PasswordFormValues) {
    const result = await changePassword(data);

    if (result.success) {
      toast.success(t('profile.security.passwordChanged'));
      form.reset();
      router.refresh();
    } else {
      toast.error(result.error || t('profile.security.failedToChangePassword'));
    }
  }

  function getPasswordStrength(password: string): {
    strength: number;
    label: string;
    color: string;
  } {
    let strength = 0;

    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) {
      return { strength, label: t('profile.security.passwordStrength.weak'), color: passwordStrengthColors.weak.text };
    } else if (strength <= 3) {
      return { strength, label: t('profile.security.passwordStrength.medium'), color: passwordStrengthColors.medium.text };
    } else {
      return { strength, label: t('profile.security.passwordStrength.strong'), color: passwordStrengthColors.strong.text };
    }
  }

  const newPassword = form.watch("newPassword");
  const passwordStrength = newPassword
    ? getPasswordStrength(newPassword)
    : null;

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.security.changePassword')}</CardTitle>
          <CardDescription>
            {t('profile.security.changePasswordDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOAuthUser ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>{t('profile.security.oauthAccount')}</AlertTitle>
              <AlertDescription>
                {t('profile.security.oauthAccountDescription', { provider: user.authProvider })}
              </AlertDescription>
            </Alert>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.security.currentPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.security.newPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      {passwordStrength && (
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            <div className="h-1 flex-1 rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  passwordStrength.strength <= 2
                                    ? passwordStrengthColors.weak.bg
                                    : passwordStrength.strength <= 3
                                    ? passwordStrengthColors.medium.bg
                                    : passwordStrengthColors.strong.bg
                                }`}
                                style={{
                                  width: `${(passwordStrength.strength / 5) * 100}%`,
                                }}
                              />
                            </div>
                            <span
                              className={`text-xs font-medium ${passwordStrength.color}`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        {t('profile.security.passwordRequirements')}
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('profile.security.confirmNewPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="me-2 h-4 w-4 animate-spin" />
                      {t('profile.security.changingPassword')}
                    </>
                  ) : (
                    t('profile.security.changePassword')
                  )}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.security.twoFactorAuth')}</CardTitle>
          <CardDescription>
            {t('profile.security.twoFactorAuthDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>{t('profile.security.comingSoon')}</AlertTitle>
            <AlertDescription>
              {t('profile.security.twoFactorAuthComingSoon')}
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>{t('profile.security.twoFactorFeature1')}</li>
                <li>{t('profile.security.twoFactorFeature2')}</li>
                <li>{t('profile.security.twoFactorFeature3')}</li>
              </ul>
              <p className="mt-3 text-sm font-medium">
                {t('profile.security.checkBackSoon')}
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.security.activeSessions')}</CardTitle>
          <CardDescription>
            {t('profile.security.activeSessionsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>{t('profile.security.sessionManagement')}</AlertTitle>
            <AlertDescription>
              {t('profile.security.sessionManagementDescription')}
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>{t('profile.security.sessionFeature1')}</li>
                <li>{t('profile.security.sessionFeature2')}</li>
                <li>{t('profile.security.sessionFeature3')}</li>
                <li>{t('profile.security.sessionFeature4')}</li>
              </ul>
              <p className="mt-3 text-sm">
                {t('profile.security.currentLogoutInfo')}
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            {t('profile.security.securityBestPractices')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                {t('profile.security.practice1')}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                {t('profile.security.practice2')}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                {t('profile.security.practice3')}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                {t('profile.security.practice4')}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                {t('profile.security.practice5')}
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
