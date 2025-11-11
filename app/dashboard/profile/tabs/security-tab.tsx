"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface User {
  authProvider: string;
}

interface SecurityTabProps {
  user: User;
}

export function SecurityTab({ user }: SecurityTabProps) {
  const router = useRouter();
  const isOAuthUser = user.authProvider !== "email";

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
      toast.success("Password changed successfully");
      form.reset();
      router.refresh();
    } else {
      toast.error(result.error || "Failed to change password");
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
      return { strength, label: "Weak", color: "text-red-500" };
    } else if (strength <= 3) {
      return { strength, label: "Medium", color: "text-yellow-500" };
    } else {
      return { strength, label: "Strong", color: "text-green-500" };
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
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isOAuthUser ? (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>OAuth Account</AlertTitle>
              <AlertDescription>
                You signed in using {user.authProvider}. Password management is
                handled by your OAuth provider. To change your password, please
                visit your {user.authProvider} account settings.
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
                      <FormLabel>Current Password</FormLabel>
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
                      <FormLabel>New Password</FormLabel>
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
                                    ? "bg-red-500"
                                    : passwordStrength.strength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
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
                        Password must be at least 8 characters with a mix of
                        letters, numbers, and symbols
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
                      <FormLabel>Confirm New Password</FormLabel>
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
                      Changing Password...
                    </>
                  ) : (
                    "Change Password"
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
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Coming Soon</AlertTitle>
            <AlertDescription>
              Two-factor authentication (2FA) is currently in development. This
              feature will allow you to:
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Enable TOTP-based 2FA using an authenticator app</li>
                <li>Generate and store backup codes for account recovery</li>
                <li>Require 2FA for all login attempts</li>
              </ul>
              <p className="mt-3 text-sm font-medium">
                Check back soon for this security enhancement!
              </p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>
            Manage devices where you&apos;re currently logged in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Session Management</AlertTitle>
            <AlertDescription>
              Session management features are currently in development. Future
              features will include:
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>View all active sessions with device and location info</li>
                <li>Log out from specific devices remotely</li>
                <li>See last active time for each session</li>
                <li>Receive alerts for new login attempts</li>
              </ul>
              <p className="mt-3 text-sm">
                Currently, you can sign out from all devices by using the logout
                button in the sidebar.
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
            Security Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                Use a unique password that you don&apos;t use for other accounts
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                Enable two-factor authentication when it becomes available
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                Change your password regularly (every 3-6 months recommended)
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                Never share your password or login credentials with anyone
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-amber-600 dark:text-amber-400">•</span>
              <span>
                Log out from shared or public devices after use
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
