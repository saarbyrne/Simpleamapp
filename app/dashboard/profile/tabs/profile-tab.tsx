"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Upload, User as UserIcon } from "lucide-react";
import { updateProfile, uploadAvatar } from "@/app/actions/profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  authProvider: string;
  organization: {
    id: string;
    name: string;
    logo: string | null;
  };
  roles: Array<{
    name: string;
    permissions: string[];
  }>;
}

interface ProfileTabProps {
  user: User;
}

export function ProfileTab({ user }: ProfileTabProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone || "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: ProfileFormValues) {
    const result = await updateProfile({
      name: data.name,
      phone: data.phone || null,
      avatar: avatarUrl,
    });

    if (result.success) {
      toast.success("Profile updated successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update profile");
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadAvatar(formData);

      if (result.success && result.data?.avatar) {
        setAvatarUrl(result.data.avatar);
        toast.success("Avatar uploaded successfully");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to upload avatar");
      }
    } catch (error) {
      toast.error("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  }

  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
          <CardDescription>
            Upload a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl || undefined} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              JPG, PNG or GIF. Max size 5MB.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                </FormControl>
                <FormDescription>
                  Email cannot be changed. Contact your administrator if you need
                  to update your email.
                </FormDescription>
              </FormItem>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Used for SMS notifications and account recovery
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Organization Membership */}
      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
          <CardDescription>Your organization membership and roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={user.organization.logo || undefined}
                alt={user.organization.name}
              />
              <AvatarFallback>
                <UserIcon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div>
                <h3 className="font-semibold">{user.organization.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Organization ID: {user.organization.id}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    {role.name}
                  </Badge>
                ))}
              </div>

              {user.roles.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    View Permissions
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {user.roles.flatMap((role) =>
                      role.permissions.map((permission, idx) => (
                        <li
                          key={`${role.name}-${idx}`}
                          className="text-sm text-muted-foreground"
                        >
                          • {permission.replace(/_/g, " ").toLowerCase()}
                        </li>
                      ))
                    )}
                  </ul>
                </details>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
