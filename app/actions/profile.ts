'use server'

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { createServerClient } from "@/lib/supabase/server";
import { ensureUserWithOrganization } from "@/lib/auth/ensure-user";

// ============================================
// VALIDATION SCHEMAS
// ============================================

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  phone: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
});

const updatePreferencesSchema = z.object({
  language: z.string().optional().nullable(),
  timezone: z.string().optional().nullable(),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]).optional().nullable(),
  timeFormat: z.enum(["12", "24"]).optional().nullable(),
  theme: z.enum(["light", "dark", "system"]).optional().nullable(),
  experimentalTheme: z.enum(["default", "liquid-glass", "flat"]).optional().nullable(),
});

const updateNotificationSettingsSchema = z.object({
  email: z.object({
    formAssigned: z.boolean().optional(),
    eventReminder: z.boolean().optional(),
    playerUpdate: z.boolean().optional(),
    aiInsight: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
  }).optional(),
  push: z.object({
    formDue: z.boolean().optional(),
    eventStarting: z.boolean().optional(),
    mentions: z.boolean().optional(),
  }).optional(),
  sms: z.object({
    enabled: z.boolean().optional(),
    urgent: z.boolean().optional(),
  }).optional(),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// ============================================
// PROFILE ACTIONS
// ============================================

export async function getCurrentUserProfile() {
  try {
    const supabase = await createServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return { success: false, error: "Authentication required" };
    }

    // Ensure user exists in database and has organization
    const dbUser = await ensureUserWithOrganization(authUser);

    // Add retry logic for database queries to handle temporary connection issues
    let user;
    let retries = 3;

    while (retries > 0) {
      try {
        user = await prisma.user.findUnique({
          where: { id: dbUser.id },
          include: {
            organization: {
              select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
              },
            },
            roles: {
              include: {
                role: {
                  select: {
                    name: true,
                    permissions: true,
                  },
                },
              },
            },
          },
        });
        break; // Success, exit retry loop
      } catch (dbError) {
        retries--;
        if (retries === 0) {
          throw dbError; // Re-throw the error if all retries failed
        }
        console.warn(`Database query failed, ${retries} retries remaining:`, dbError);
        // Wait 100ms before retry
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    if (!user) {
      return { success: false, error: "User not found" };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phone: user.phone,
        authProvider: user.authProvider,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLoginAt: user.lastLoginAt,
        language: user.language,
        timezone: user.timezone,
        dateFormat: user.dateFormat,
        timeFormat: user.timeFormat,
        theme: user.theme,
        experimentalTheme: user.experimentalTheme,
        notificationSettings: user.notificationSettings,
        organization: user.organization,
        roles: user.roles.map((ur) => ur.role),
      },
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check if it's a database connection error
      if (error.message.includes("does not exist") || error.message.includes("relation")) {
        return { 
          success: false, 
          error: `Database error: ${error.message}. Tables may not exist.` 
        };
      }
      if (error.message.includes("P1001") || error.message.includes("Can't reach database")) {
        return { 
          success: false, 
          error: "Database connection failed. Please check your DATABASE_URL." 
        };
      }
      // Return the actual error message
      return { 
        success: false, 
        error: `Error: ${error.message}` 
      };
    }
    
    return { success: false, error: "Failed to fetch profile" };
  }
}

export async function updateProfile(data: z.infer<typeof updateProfileSchema>) {
  try {
    const validation = updateProfileSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const supabase = await createServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return { success: false, error: "Authentication required" };
    }

    const dbUser = await ensureUserWithOrganization(authUser);

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        name: validation.data.name,
        phone: validation.data.phone,
        avatar: validation.data.avatar,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updatePreferences(data: z.infer<typeof updatePreferencesSchema>) {
  try {
    const validation = updatePreferencesSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const supabase = await createServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return { success: false, error: "Authentication required" };
    }

    const dbUser = await ensureUserWithOrganization(authUser);

    // Only update fields that are actually provided (not undefined)
    const updateData: {
      language?: string | null;
      timezone?: string | null;
      dateFormat?: string | null;
      timeFormat?: string | null;
      theme?: string | null;
      experimentalTheme?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (validation.data.language !== undefined) {
      updateData.language = validation.data.language || null;
    }
    if (validation.data.timezone !== undefined) {
      updateData.timezone = validation.data.timezone || null;
    }
    if (validation.data.dateFormat !== undefined) {
      updateData.dateFormat = validation.data.dateFormat || null;
    }
    if (validation.data.timeFormat !== undefined) {
      updateData.timeFormat = validation.data.timeFormat || null;
    }
    if (validation.data.theme !== undefined) {
      updateData.theme = validation.data.theme || null;
    }
    if (validation.data.experimentalTheme !== undefined) {
      updateData.experimentalTheme = validation.data.experimentalTheme || null;
    }

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: updateData,
    });

    // Don't revalidate paths - UI updates instantly via localStorage
    // Data will be fresh on next navigation
    // revalidatePath("/dashboard/profile");
    // revalidatePath("/dashboard");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating preferences:", error);
    return { success: false, error: "Failed to update preferences" };
  }
}

export async function updateNotificationSettings(
  data: z.infer<typeof updateNotificationSettingsSchema>
) {
  try {
    const validation = updateNotificationSettingsSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const supabase = await createServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return { success: false, error: "Authentication required" };
    }

    const dbUser = await ensureUserWithOrganization(authUser);

    // Get current notification settings
    const currentUser = await prisma.user.findUnique({
      where: { id: dbUser.id },
      select: { notificationSettings: true },
    });

    // Merge with existing settings
    const currentSettings = (currentUser?.notificationSettings as any) || {};
    const mergedSettings = {
      email: { ...currentSettings.email, ...validation.data.email },
      push: { ...currentSettings.push, ...validation.data.push },
      sms: { ...currentSettings.sms, ...validation.data.sms },
    };

    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        notificationSettings: mergedSettings,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating notification settings:", error);
    return { success: false, error: "Failed to update notification settings" };
  }
}

export async function changePassword(data: z.infer<typeof changePasswordSchema>) {
  try {
    const validation = changePasswordSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.issues[0].message,
      };
    }

    const supabase = await createServerClient();

    // Update password through Supabase Auth
    const { error } = await supabase.auth.updateUser({
      password: validation.data.newPassword,
    });

    if (error) {
      console.error("Supabase password update error:", error);
      return {
        success: false,
        error: "Failed to update password. Please try again.",
      };
    }

    return {
      success: true,
      message: "Password updated successfully",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Failed to change password" };
  }
}

export async function uploadAvatar(formData: FormData) {
  try {
    const file = formData.get("file") as File;

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "File must be an image" };
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "File size must be less than 5MB" };
    }

    const supabase = await createServerClient();
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      return { success: false, error: "Authentication required" };
    }

    const dbUser = await ensureUserWithOrganization(authUser);

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${dbUser.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage - use people-photos bucket which is already configured
    const { error: uploadError } = await supabase.storage
      .from("people-photos")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Provide more specific error message
      if (uploadError.message?.includes("Bucket not found")) {
        return { success: false, error: "Storage bucket not configured. Please contact support." };
      }
      return { success: false, error: `Failed to upload file: ${uploadError.message}` };
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("people-photos")
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      return { success: false, error: "Failed to get file URL" };
    }

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        avatar: urlData.publicUrl,
        updatedAt: new Date(),
      },
    });

    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        avatar: updatedUser.avatar,
      },
    };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { success: false, error: "Failed to upload avatar" };
  }
}

// ============================================
// AUTH ACTIONS
// ============================================

export async function signOut() {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Sign out error:", error);
      return { success: false, error: "Failed to sign out" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error signing out:", error);
    return { success: false, error: "Failed to sign out" };
  }
}
