"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { updateNotificationSettings } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

interface NotificationSettings {
  email?: {
    formAssigned?: boolean;
    eventReminder?: boolean;
    playerUpdate?: boolean;
    aiInsight?: boolean;
    weeklyDigest?: boolean;
  };
  push?: {
    formDue?: boolean;
    eventStarting?: boolean;
    mentions?: boolean;
  };
  sms?: {
    enabled?: boolean;
    urgent?: boolean;
  };
}

interface User {
  notificationSettings: NotificationSettings | null;
}

interface NotificationsTabProps {
  user: User;
}

export function NotificationsTab({ user }: NotificationsTabProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize notification settings with defaults
  const initialSettings: NotificationSettings = user.notificationSettings || {
    email: {
      formAssigned: true,
      eventReminder: true,
      playerUpdate: true,
      aiInsight: false,
      weeklyDigest: true,
    },
    push: {
      formDue: true,
      eventStarting: true,
      mentions: true,
    },
    sms: {
      enabled: false,
      urgent: false,
    },
  };

  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  function updateSetting(
    category: keyof NotificationSettings,
    key: string,
    value: boolean
  ) {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await updateNotificationSettings(settings);

    if (result.success) {
      toast.success("Notification settings updated successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update notification settings");
    }

    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what updates you want to receive via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Form assigned to you</Label>
              <p className="text-sm text-muted-foreground">
                When you're assigned a form to complete
              </p>
            </div>
            <Switch
              checked={settings.email?.formAssigned ?? true}
              onCheckedChange={(checked) =>
                updateSetting("email", "formAssigned", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Event reminders</Label>
              <p className="text-sm text-muted-foreground">
                Reminders before scheduled events
              </p>
            </div>
            <Switch
              checked={settings.email?.eventReminder ?? true}
              onCheckedChange={(checked) =>
                updateSetting("email", "eventReminder", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Player updates</Label>
              <p className="text-sm text-muted-foreground">
                When players you manage are updated
              </p>
            </div>
            <Switch
              checked={settings.email?.playerUpdate ?? true}
              onCheckedChange={(checked) =>
                updateSetting("email", "playerUpdate", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>AI insights</Label>
              <p className="text-sm text-muted-foreground">
                When AI detects important patterns
              </p>
            </div>
            <Switch
              checked={settings.email?.aiInsight ?? false}
              onCheckedChange={(checked) =>
                updateSetting("email", "aiInsight", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Weekly digest</Label>
              <p className="text-sm text-muted-foreground">
                Summary of the week's activity
              </p>
            </div>
            <Switch
              checked={settings.email?.weeklyDigest ?? true}
              onCheckedChange={(checked) =>
                updateSetting("email", "weeklyDigest", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Push Notifications</CardTitle>
          <CardDescription>
            Receive instant notifications in your browser or mobile app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Form due soon</Label>
              <p className="text-sm text-muted-foreground">
                When forms are due within 1 hour
              </p>
            </div>
            <Switch
              checked={settings.push?.formDue ?? true}
              onCheckedChange={(checked) =>
                updateSetting("push", "formDue", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Event starting</Label>
              <p className="text-sm text-muted-foreground">
                15 minutes before events
              </p>
            </div>
            <Switch
              checked={settings.push?.eventStarting ?? true}
              onCheckedChange={(checked) =>
                updateSetting("push", "eventStarting", checked)
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Mentions</Label>
              <p className="text-sm text-muted-foreground">
                When someone mentions you in a note
              </p>
            </div>
            <Switch
              checked={settings.push?.mentions ?? true}
              onCheckedChange={(checked) =>
                updateSetting("push", "mentions", checked)
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* SMS Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Notifications (Optional)</CardTitle>
          <CardDescription>
            Receive critical notifications via text message
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable SMS notifications</Label>
              <p className="text-sm text-muted-foreground">
                Requires a verified phone number
              </p>
            </div>
            <Switch
              checked={settings.sms?.enabled ?? false}
              onCheckedChange={(checked) =>
                updateSetting("sms", "enabled", checked)
              }
            />
          </div>

          {settings.sms?.enabled && (
            <>
              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Urgent alerts only</Label>
                  <p className="text-sm text-muted-foreground">
                    Only receive critical notifications
                  </p>
                </div>
                <Switch
                  checked={settings.sms?.urgent ?? false}
                  onCheckedChange={(checked) =>
                    updateSetting("sms", "urgent", checked)
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Notification Settings"
        )}
      </Button>
    </form>
  );
}
